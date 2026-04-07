import {
  Injectable,
  NotFoundException,
  ConflictException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Favorite } from "./entities/favorite.entity"
import { Recipe } from "../recipes/entities/recipe.entity"

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>
  ) {}

  async addFavorite(userId: string, recipeId: string) {
    const recipe = await this.recipeModel.findById(recipeId).exec()
    if (!recipe) {
      throw new NotFoundException("Recipe not found")
    }

    const existing = await this.favoriteModel
      .findOne({
        userId: new Types.ObjectId(userId),
        recipeId: new Types.ObjectId(recipeId)
      })
      .exec()

    if (existing) {
      throw new ConflictException("Recipe already favorited")
    }

    await this.favoriteModel.create({
      userId: new Types.ObjectId(userId),
      recipeId: new Types.ObjectId(recipeId)
    })

    const favoritesCount = await this.favoriteModel.countDocuments({
      recipeId: new Types.ObjectId(recipeId)
    })

    return { favorited: true, favoritesCount }
  }

  async removeFavorite(userId: string, recipeId: string) {
    const recipe = await this.recipeModel.findById(recipeId).exec()
    if (!recipe) {
      throw new NotFoundException("Recipe not found")
    }

    const deleted = await this.favoriteModel
      .findOneAndDelete({
        userId: new Types.ObjectId(userId),
        recipeId: new Types.ObjectId(recipeId)
      })
      .exec()

    if (!deleted) {
      throw new NotFoundException("Favorite not found")
    }

    const favoritesCount = await this.favoriteModel.countDocuments({
      recipeId: new Types.ObjectId(recipeId)
    })

    return { favorited: false, favoritesCount }
  }

  async getUserFavorites(userId: string, skip = 0, limit = 20) {
    const safeSkip = Math.max(0, skip)
    const safeLimit = Math.min(Math.max(1, limit), 100)

    const filter = { userId: new Types.ObjectId(userId) }

    const [favorites, total] = await Promise.all([
      this.favoriteModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(safeSkip)
        .limit(safeLimit)
        .exec(),
      this.favoriteModel.countDocuments(filter)
    ])

    const recipeIds = favorites.map((f) => f.recipeId)
    const recipes = await this.recipeModel
      .find({ _id: { $in: recipeIds } })
      .exec()

    const recipeMap = new Map(recipes.map((r) => [r._id.toString(), r]))
    const orderedRecipes = recipeIds
      .map((id) => recipeMap.get(id.toString()))
      .filter(Boolean)

    return { data: orderedRecipes, total }
  }

  async getFavoritesCount(recipeId: string): Promise<number> {
    return this.favoriteModel.countDocuments({
      recipeId: new Types.ObjectId(recipeId)
    })
  }

  async isFavorited(userId: string, recipeId: string): Promise<boolean> {
    const favorite = await this.favoriteModel
      .findOne({
        userId: new Types.ObjectId(userId),
        recipeId: new Types.ObjectId(recipeId)
      })
      .exec()
    return !!favorite
  }

  async deleteByRecipeId(recipeId: string): Promise<void> {
    await this.favoriteModel
      .deleteMany({ recipeId: new Types.ObjectId(recipeId) })
      .exec()
  }
}
