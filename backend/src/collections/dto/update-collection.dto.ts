import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl
} from "class-validator"

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @IsUrl()
  coverImage?: string
}
