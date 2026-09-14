import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ubahProduk } from "../../actions";

export default async function HalamanEditProduk({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produk = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!produk) {
    notFound();
  }

  // "ikat" id ke action supaya ubahProduk tahu produk mana yang diedit
  const ubahDenganId = ubahProduk.bind(null, produk.id);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Produk</h1>

      <form action={ubahDenganId} className="space-y-4">
        <div>
          <label className="mb-1 block font-medium">Nama Produk</label>
          <input
            type="text"
            name="name"
            defaultValue={produk.name}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            defaultValue={produk.price}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Stok</label>
          <input
            type="number"
            name="stock"
            defaultValue={produk.stock}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Deskripsi</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={produk.description}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Gambar Produk</label>
          {produk.imageUrl && (
            <img
              src={produk.imageUrl}
              alt={produk.name}
              className="mb-2 h-32 w-32 rounded border object-cover"
            />
          )}
          <input
            type="file"
            name="gambar"
            accept="image/*"
            className="w-full rounded border p-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Biarkan kosong kalau tidak mau mengubah gambar yang sudah ada.
          </p>
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}