import { Transform } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

const EMAIL_OPTIONS = {
  allow_ip_domain: false,
  disable_ip_regex: true,
  require_tld: true,
  domain_specific_validation: true
}

export class ChangeEmailDto {
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  @IsEmail(EMAIL_OPTIONS, { message: "Adresse email invalide" })
  newEmail: string

  @IsString()
  @IsNotEmpty({ message: "Le mot de passe est requis" })
  password: string
}
