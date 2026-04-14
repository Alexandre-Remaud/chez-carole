import { IsOptional, IsString } from "class-validator"

export class GetCollectionsDto {
  @IsOptional()
  @IsString()
  skip?: string

  @IsOptional()
  @IsString()
  limit?: string
}
