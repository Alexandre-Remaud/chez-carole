import { IsMongoId, IsNumber, IsOptional, Min } from "class-validator"

export class AddRecipeDto {
  @IsMongoId()
  recipeId: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  servings?: number
}
