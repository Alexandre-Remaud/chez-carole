import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  MaxLength,
  IsMongoId,
  ValidateNested,
  IsNumber,
  Min
} from "class-validator"
import { Type } from "class-transformer"

class ServingsOverrideDto {
  @IsMongoId()
  recipeId: string

  @IsNumber()
  @Min(1)
  servings: number
}

export class CreateShoppingListDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @IsArray()
  @IsMongoId({ each: true })
  recipeIds: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServingsOverrideDto)
  servingsOverrides?: ServingsOverrideDto[]
}
