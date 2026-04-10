import { Test, TestingModule } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { RecipesController } from "./recipes.controller"
import { RecipesService } from "./recipes.service"
import { CreateRecipeDto } from "./dto/create-recipe.dto"
import { UpdateRecipeDto } from "./dto/update-recipe.dto"
import { Role } from "../auth/role.enum"

const VALID_ID = "507f1f77bcf86cd799439011"
const USER_ID = "507f1f77bcf86cd799439012"

const mockRecipe = {
  _id: VALID_ID,
  title: "Tarte aux pommes",
  description: "Une tarte classique",
  ingredients: [{ name: "Pommes", quantity: 4, unit: "pièces" }],
  steps: [{ order: 1, instruction: "Éplucher les pommes" }],
  userId: USER_ID,
  favoritesCount: 0,
  isFavorited: false
}

const paginatedResult = { data: [mockRecipe], total: 1 }

const mockRecipesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}

const mockConfigService = {
  get: jest.fn().mockReturnValue("http://localhost:5173")
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
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()

    controller = module.get<RecipesController>(RecipesController)
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("should delegate to service.create with userId", async () => {
      const dto: CreateRecipeDto = {
        title: "Tarte aux pommes",
        description: "Une tarte classique",
        ingredients: [{ name: "Pommes", quantity: 4, unit: "pièces" }],
        steps: [{ order: 1, instruction: "Éplucher les pommes" }]
      }
      mockRecipesService.create.mockResolvedValue(mockRecipe)

      const result = await controller.create(dto, USER_ID)

      expect(mockRecipesService.create).toHaveBeenCalledWith(dto, USER_ID)
      expect(result).toEqual(mockRecipe)
    })
  })

  describe("findAll", () => {
    it("should call service.findAll with defaults when no params", async () => {
      mockRecipesService.findAll.mockResolvedValue(paginatedResult)

      const result = await controller.findAll()

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        0,
        20,
        undefined
      )
      expect(result).toEqual(paginatedResult)
    })

    it("should call service.findAll with category", async () => {
      mockRecipesService.findAll.mockResolvedValue(paginatedResult)

      await controller.findAll("dessert")

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        "dessert",
        undefined,
        0,
        20,
        undefined
      )
    })

    it("should call service.findAll with search", async () => {
      mockRecipesService.findAll.mockResolvedValue(paginatedResult)

      await controller.findAll(undefined, "tarte")

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        undefined,
        "tarte",
        0,
        20,
        undefined
      )
    })

    it("should parse skip and limit query params", async () => {
      mockRecipesService.findAll.mockResolvedValue(paginatedResult)

      await controller.findAll(undefined, undefined, "20", "10")

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        20,
        10,
        undefined
      )
    })

    it("should combine category, skip and limit", async () => {
      mockRecipesService.findAll.mockResolvedValue(paginatedResult)

      await controller.findAll("starter", undefined, "40", "20")

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        "starter",
        undefined,
        40,
        20,
        undefined
      )
    })
  })

  describe("findOne", () => {
    it("should delegate to service.findOne with the id", async () => {
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)

      const result = await controller.findOne(VALID_ID, undefined)

      expect(mockRecipesService.findOne).toHaveBeenCalledWith(
        VALID_ID,
        undefined
      )
      expect(result).toEqual(mockRecipe)
    })
  })

  describe("update", () => {
    it("should delegate to service.update with the id and dto when owner", async () => {
      const dto: UpdateRecipeDto = { title: "Tarte revisitée" }
      const updated = { ...mockRecipe, ...dto }
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)
      mockRecipesService.update.mockResolvedValue(updated)

      const result = await controller.update(VALID_ID, dto, USER_ID, Role.USER)

      expect(mockRecipesService.findOne).toHaveBeenCalledWith(VALID_ID)
      expect(mockRecipesService.update).toHaveBeenCalledWith(VALID_ID, dto)
      expect(result).toEqual(updated)
    })

    it("should allow admin to update any recipe", async () => {
      const dto: UpdateRecipeDto = { title: "Admin update" }
      const updated = { ...mockRecipe, ...dto }
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)
      mockRecipesService.update.mockResolvedValue(updated)

      const result = await controller.update(
        VALID_ID,
        dto,
        "other-user-id",
        Role.ADMIN
      )

      expect(mockRecipesService.update).toHaveBeenCalledWith(VALID_ID, dto)
      expect(result).toEqual(updated)
    })
  })

  describe("remove", () => {
    it("should delegate to service.remove with the id when owner", async () => {
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)
      mockRecipesService.remove.mockResolvedValue(mockRecipe)

      const result = await controller.remove(VALID_ID, USER_ID, Role.USER)

      expect(mockRecipesService.findOne).toHaveBeenCalledWith(VALID_ID)
      expect(mockRecipesService.remove).toHaveBeenCalledWith(VALID_ID)
      expect(result).toEqual(mockRecipe)
    })

    it("should allow admin to delete any recipe", async () => {
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)
      mockRecipesService.remove.mockResolvedValue(mockRecipe)

      const result = await controller.remove(
        VALID_ID,
        "other-user-id",
        Role.ADMIN
      )

      expect(mockRecipesService.remove).toHaveBeenCalledWith(VALID_ID)
      expect(result).toEqual(mockRecipe)
    })
  })

  describe("getOpenGraph", () => {
    it("should return OG metadata with correct title and url", async () => {
      mockRecipesService.findOne.mockResolvedValue(mockRecipe)

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.title).toBe("Tarte aux pommes")
      expect(result.url).toBe(`http://localhost:5173/recipes/${VALID_ID}`)
    })

    it("should truncate description to 160 chars", async () => {
      const longDesc = "A".repeat(200)
      mockRecipesService.findOne.mockResolvedValue({
        ...mockRecipe,
        description: longDesc
      })

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.description).toBe("A".repeat(157) + "...")
      expect(result.description.length).toBe(160)
    })

    it("should return full description when <= 160 chars", async () => {
      const shortDesc = "Une tarte classique"
      mockRecipesService.findOne.mockResolvedValue({
        ...mockRecipe,
        description: shortDesc
      })

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.description).toBe(shortDesc)
    })

    it("should return empty description when recipe has no description", async () => {
      mockRecipesService.findOne.mockResolvedValue({
        ...mockRecipe,
        description: undefined
      })

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.description).toBe("")
    })

    it("should prefer imageMediumUrl over imageUrl", async () => {
      mockRecipesService.findOne.mockResolvedValue({
        ...mockRecipe,
        imageMediumUrl: "http://img.test/medium.jpg",
        imageUrl: "http://img.test/full.jpg"
      })

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.imageUrl).toBe("http://img.test/medium.jpg")
    })

    it("should fallback to imageUrl when no imageMediumUrl", async () => {
      mockRecipesService.findOne.mockResolvedValue({
        ...mockRecipe,
        imageMediumUrl: undefined,
        imageUrl: "http://img.test/full.jpg"
      })

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.imageUrl).toBe("http://img.test/full.jpg")
    })

    it("should return null imageUrl when no images", async () => {
      mockRecipesService.findOne.mockResolvedValue({
        ...mockRecipe,
        imageMediumUrl: undefined,
        imageUrl: undefined
      })

      const result = await controller.getOpenGraph(VALID_ID)

      expect(result.imageUrl).toBeNull()
    })
  })
})
