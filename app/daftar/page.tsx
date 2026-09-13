"use client";

import Link from "next/link";
import { useActionState } from "react";
import { daftar } from "./actions";

export default function DaftarPage() {
  const [state, formAction, pending] = useActionState(daftar, undefined);

  return (
    <main className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Daftar Akun</h1>

      {state?.error && (
        <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama</label>
          <input
            type="text"
            name="name"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {pending ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="underline">
          Masuk di sini
        </Link>
      </p>
    </main>
  );
}