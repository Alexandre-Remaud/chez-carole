import { IsNotEmpty, IsString, Matches } from "class-validator"

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: "Le mot de passe actuel est requis" })
  currentPassword: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
  })
  newPassword: string
}
