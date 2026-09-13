import { z } from "zod";

export const daftarSchema = z.object({
  name: z.string().trim().min(1, "Nama tidak boleh kosong"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});