import { Transform } from "class-transformer"
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional
} from "class-validator"

const EMAIL_OPTIONS = {
  allow_ip_domain: false,
  disable_ip_regex: true,
  require_tld: true,
  domain_specific_validation: true
}

export class RegisterDto {
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  @IsEmail(EMAIL_OPTIONS, { message: "Adresse email invalide" })
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
  })
  password: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^.{2,100}$/, {
    message: "Le nom doit contenir entre 2 et 100 caractères"
  })
  name: string

  @IsOptional()
  role?: never
}
