import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Navbar({ jumlahItem }: { jumlahItem: number }) {  // 👈 TAMBAH prop jumlahItem di sini
  const session = await auth();

  return (
    <nav className="flex items-center justify-between border-b px-4 py-3">
      <Link href="/" className="text-lg font-bold">
        Toko Online
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/produk" className="hover:underline">
          Produk
        </Link>

        {}
        <Link href="/keranjang" className="relative inline-flex items-center hover:underline">
          Keranjang
          {jumlahItem > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-medium text-white">
              {jumlahItem}
            </span>
          )}
        </Link>

        {session && (
                <Link href="/pesanan" className="hover:underline">
                    Pesanan Saya
                </Link>
                )}        

        {session?.user.role === "admin" && (
                <Link href="/admin/produk" className="font-semibold text-blue-600">
                    Admin
                </Link>
                )}

        {session?.user ? (
          <>
            <span className="text-gray-700">
              Halo, {session.user.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded bg-gray-800 px-3 py-1  hover:bg-gray-800"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded bg-black px-3 py-1 text-white"
            >
              Daftar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}