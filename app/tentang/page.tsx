import TombolHitung from "@/components/TombolHitung";

export default function TentangPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Selamat datang di Toko Online</h1>
      <p className="mt-4 text-gray-700">
        Coba klik tombol di bawah ini :</p>
        <div className="mt-4">
            <TombolHitung />
        </div>            
    </main>
  );
}