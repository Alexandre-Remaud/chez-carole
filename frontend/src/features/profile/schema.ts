import { z } from "zod"

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  bio: z
    .string()
    .max(500, "La bio ne doit pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("L'URL de l'avatar est invalide")
    .optional()
    .or(z.literal(""))
})

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis")
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  })

export type EditProfileFormData = z.infer<typeof editProfileSchema>
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
