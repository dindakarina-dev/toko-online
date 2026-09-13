"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { daftarSchema } from "./schema";

type FormState = { error?: string } | undefined;

export async function daftar(prevState: FormState, formData: FormData) {
  // 1. Ambil data mentah dari form
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // 2. Validasi dengan Zod
  const hasil = daftarSchema.safeParse(data);
  if (!hasil.success) {
    return { error: hasil.error.issues[0].message };
  }

  const { name, email, password } = hasil.data;

  // 3. Cek email belum terpakai
  const sudahAda = await prisma.user.findUnique({ where: { email } });
  if (sudahAda) {
    return { error: "Email sudah terdaftar" };
  }

  // 4. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 5. Simpan user baru
  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // 6. Selesai, arahkan ke halaman login
  redirect("/login?pesan=Pendaftaran%20berhasil,%20silahkan%20masuk");
}