import { z } from "zod"

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const userIdSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
})

export type UserIdInput = z.infer<typeof userIdSchema>
