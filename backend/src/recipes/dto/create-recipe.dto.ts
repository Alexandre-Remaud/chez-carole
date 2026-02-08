import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsEnum,
  ValidateNested,
  ArrayMinSize
} from "class-validator";
import { Type } from "class-transformer";

class StepDto {
  @IsNumber()
  order: number;

  @IsString()
  instruction: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(["min", "sec"])
  durationUnit?: "min" | "sec";

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsEnum(["C", "F"])
  temperatureUnit?: "C" | "F";

  @IsOptional()
  @IsString()
  note?: string;
}

class IngredientDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @ArrayMinSize(1)
  ingredients: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  @ArrayMinSize(1)
  steps: StepDto[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  prepTime?: number;

  @IsOptional()
  @IsNumber()
  servings?: number;

  @IsOptional()
  @IsEnum(["easy", "medium", "hard"])
  difficulty?: "easy" | "medium" | "hard";

  @IsOptional()
  @IsString()
  category?: string;
}
