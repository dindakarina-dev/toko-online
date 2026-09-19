import { put } from "@vercel/blob";

export async function simpanGambar(file: File): Promise<string | null> {
  // Kalau tidak ada file dipilih, kembalikan null (imageUrl kosong)
  if (!file || file.size === 0) {
    return null;
  }

  // Bikin nama unik: waktu sekarang + nama asli (spasi dibuang)
  const namaUnik = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  // Sistem file Vercel read-only, jadi simpan ke Vercel Blob (butuh env
  // BLOB_READ_WRITE_TOKEN). URL yang dikembalikan bisa diakses publik.
  const blob = await put(`uploads/${namaUnik}`, file, { access: "public" });

  return blob.url;
}
