import { Test, TestingModule } from "@nestjs/testing"
import { RecipesController } from "./recipes.controller"
import { RecipesService } from "./recipes.service"
import { CreateRecipeDto } from "./dto/create-recipe.dto"
import { UpdateRecipeDto } from "./dto/update-recipe.dto"

const VALID_ID = "507f1f77bcf86cd799439011"

const mockRecipe = {
  _id: VALID_ID,
  title: "Tarte aux pommes",
  description: "Une tarte classique",
  ingredients: [{ name: "Pommes", quantity: 4, unit: "pièces" }],
  steps: [{ order: 1, instruction: "Éplucher les pommes" }]
}

const mockRecipesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}

describe("RecipesController", () => {
  let controller: RecipesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService
        }
      ]
    }).compile()

    controller = module.get<RecipesController>(RecipesController)
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("should delegate to service.create", async () => {
      const dto: CreateRecipeDto = {
        title: "Tarte aux pommes",
        description: "Une tarte classique",
        ingredients: [{ name: "Pommes", quantity: 4, unit: "pièces" }],
        steps: [{ order: 1, instruction: "Éplucher les pommes" }]
      }
      mockRecipesService.create.mockResolvedValue(mockRecipe)

      const result = await controller.create(dto)

      expect(mockRecipesService.create).toHaveBeenCalledWith(dto)
      expect(result).toEqual(mockRecipe)
    })
  })

  describe("findAll", () => {
    it("should delegate to service.findAll without category", async () => {
      const recipes = [mockRecipe]
      mockRecipesService.findAll.mockResolvedValue(recipes)

      const result = await controller.findAll()

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(undefined)
      expect(result).toEqual(recipes)
    })

    it("should delegate to service.findAll with category", async () => {
      const recipes = [mockRecipe]
      mockRecipesService.findAll.mockResolvedValue(recipes)

      const result = await controller.findAll("starter")

      expect(mockRecipesService.findAll).toHaveBeenCalledWith("starter")
      expect(result).toEqual(recipes)
    })
  })

  describe("findOne", () => {
    it("should delegate to service.findOne with the id", async () => {
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)

      const result = await controller.findOne(VALID_ID)

      expect(mockRecipesService.findOne).toHaveBeenCalledWith(VALID_ID)
      expect(result).toEqual(mockRecipe)
    })
  })

  describe("update", () => {
    it("should delegate to service.update with the id and dto", async () => {
      const dto: UpdateRecipeDto = { title: "Tarte revisitée" }
      const updated = { ...mockRecipe, ...dto }
      mockRecipesService.update.mockResolvedValue(updated)

      const result = await controller.update(VALID_ID, dto)

      expect(mockRecipesService.update).toHaveBeenCalledWith(VALID_ID, dto)
      expect(result).toEqual(updated)
    })
  })

  describe("remove", () => {
    it("should delegate to service.remove with the id", async () => {
      mockRecipesService.remove.mockResolvedValue(mockRecipe)

      const result = await controller.remove(VALID_ID)

      expect(mockRecipesService.remove).toHaveBeenCalledWith(VALID_ID)
      expect(result).toEqual(mockRecipe)
    })
  })
})
