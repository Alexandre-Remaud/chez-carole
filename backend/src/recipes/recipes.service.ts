import { Injectable } from "@nestjs/common";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Recipe } from "./entities/recipe.entity";

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto) {
    return this.recipeModel.create(createRecipeDto);
  }

  findAll() {
    return this.recipeModel.find().exec();
  }

  findOne(id: string) {
    return this.recipeModel.findById(id).exec();
  }

  update(id: string, updateRecipeDto: UpdateRecipeDto) {
    return this.recipeModel.findByIdAndUpdate(id, updateRecipeDto).exec();
  }

  remove(id: string) {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }
}
