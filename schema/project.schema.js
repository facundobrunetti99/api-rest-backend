import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string({ required_error: "El titulo es requerido" }),
  description: z.string({
    required_error: "La descripcion deberia ser uns string",
  }),
  date: z.string().datetime().optional(),
});
