import { z } from "zod";

export const idSchema = z.string({ error: "ID inválido" }).min(1, { message: "ID é obrigatório" });