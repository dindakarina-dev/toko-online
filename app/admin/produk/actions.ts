// "use server";

// import { prisma } from "@/lib/prisma";
// import{ revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { simpanGambar } from "@/lib/upload";

// export async function buatProduk(formData: FormData) {
//   const name = formData.get("name") as string;
//   const price = Number(formData.get("price"));
//   const stock = Number(formData.get("stock"));
//   const description = formData.get("description") as string;
//   const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

//   // Ambil file dari input bernama "gambar" lalu simpan
//   const file = formData.get("gambar") as File;
//   const imageUrl = await simpanGambar(file);

//   await prisma.product.create({
//     data: { name, slug, price, stock, description, imageUrl },
//   });

//   revalidatePath("/admin/produk");
//   redirect("/admin/produk");
// }

// export async function ubahProduk(id: number, formData: FormData) {
//     const name = formData.get("name") as string;
//     const price = Number(formData.get("price"));
//     const stock = Number(formData.get("stock"));
//     const description = formData.get("description") as string;
//     const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

//     await prisma.product.update({
//         where: { id },
//         data: {
//             name,
//             slug,
//             price,
//             stock,
//             description,
//         },
//     });

//     revalidatePath("/admin/produk");
//     redirect("/admin/produk");
// }

// export async function hapusProduk(id: number) {
//     await prisma.product.delete({
//         where: { id },
//     });

//     revalidatePath("/admin/produk");
//     redirect("/admin/produk");
// }

//  CATATAN: tutorial pakai fungsi baru "tambahProduk" + useActionState,
// tapi kita gabung ke "buatProduk" yang sudah ada (form masih Server
// Component). Field slug/description/imageUrl ditambahkan karena wajib
// di database kita, tidak dibahas tutorial.

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { simpanGambar } from "@/lib/upload";
import { produkSchema } from "./schema";

export async function buatProduk(formData: FormData) {
  // Bagian 4 cek otorisasi dulu, sebelum apa pun
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  // validasi Zod (dari tutorial)
  const hasil = produkSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
  });

  if (!hasil.success) {
    // beda dari tutorial: redirect, bukan return (form kita masih Server Component)
    redirect(`/admin/produk/baru?error=${encodeURIComponent(hasil.error.issues[0].message)}`);
  }

  const { name, price, stock } = hasil.data;

  // tambahan: field yang tutorial gak bahas tapi wajib di schema kita
  const description = formData.get("description") as string;
  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
  const imageUrl = await simpanGambar(formData.get("gambar") as File);

  // bagian 7 bungkus dengan try...catch
  try{
    await prisma.product.create({
      data:{ name, slug, price, stock, description, imageUrl},
    });
  } catch (e) {
    console.error("Gagal menyimpan produk:", e); // detail lengkap, cuma kamu yang lihat
    redirect(`/admin/produk/baru?error=${encodeURIComponent("Terjadi kesalahan. Coba lagi sebentar.")}`);
  }
  
  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// tidak berubah dari Modul 9
export async function ubahProduk(id: number, formData: FormData) {
  // Bagian 4 cek otorisasi
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const description = formData.get("description") as string;
  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

   try {
    await prisma.product.update({
      where: { id },
      data: { name, slug, price, stock, description },
    });
  } catch (e) {
    console.error("Gagal mengubah produk:", e);
    redirect(`/admin/produk/${id}/edit?error=${encodeURIComponent("Terjadi kesalahan. Coba lagi sebentar.")}`);
  }

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

export async function hapusProduk(id: number) {
  // bagian 4 cek otorisasii
   const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    console.error("Gagal menghapus produk:", e);
    // untuk hapus, cukup log saja — tidak ada halaman untuk redirect+pesan
  }

  revalidatePath("/admin/produk");
}