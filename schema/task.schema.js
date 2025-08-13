import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({ required_error: "El titulo es requerido" })
    .min(1, "El título no puede estar vacío"),
  description: z.string({ required_error: "La descripcion es requerida" })
    .min(1, "La descripción no puede estar vacía"), 
  date: z.string().datetime().optional(),
});