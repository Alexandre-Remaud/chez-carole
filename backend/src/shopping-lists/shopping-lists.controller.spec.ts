import { Test, TestingModule } from "@nestjs/testing"
import { ShoppingListsController } from "./shopping-lists.controller"
import { ShoppingListsService } from "./shopping-lists.service"

const USER_ID = "507f1f77bcf86cd799439011"
const LIST_ID = "507f1f77bcf86cd799439012"
const ITEM_ID = "507f1f77bcf86cd799439013"

const mockList = { _id: LIST_ID, name: "Ma liste", items: [] }
const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  rename: jest.fn(),
  addRecipe: jest.fn(),
  toggleItem: jest.fn(),
  remove: jest.fn()
}

describe("ShoppingListsController", () => {
  let controller: ShoppingListsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListsController],
      providers: [{ provide: ShoppingListsService, useValue: mockService }]
    }).compile()

    controller = module.get<ShoppingListsController>(ShoppingListsController)
    jest.clearAllMocks()
  })

  it("create should delegate to service", async () => {
    mockService.create.mockResolvedValue(mockList)
    const dto = { name: "Ma liste", recipeIds: ["abc123"] }
    const result = await controller.create(USER_ID, dto as never)
    expect(mockService.create).toHaveBeenCalledWith(USER_ID, dto)
    expect(result).toBe(mockList)
  })

  it("findAll should delegate to service", async () => {
    mockService.findAll.mockResolvedValue({ data: [mockList], total: 1 })
    const result = await controller.findAll(USER_ID)
    expect(mockService.findAll).toHaveBeenCalledWith(USER_ID)
    expect(result).toEqual({ data: [mockList], total: 1 })
  })

  it("findOne should delegate to service", async () => {
    mockService.findOne.mockResolvedValue(mockList)
    const result = await controller.findOne(USER_ID, LIST_ID)
    expect(mockService.findOne).toHaveBeenCalledWith(USER_ID, LIST_ID)
    expect(result).toBe(mockList)
  })

  it("rename should delegate to service", async () => {
    mockService.rename.mockResolvedValue({ ...mockList, name: "Nouveau" })
    const result = await controller.rename(USER_ID, LIST_ID, {
      name: "Nouveau"
    } as never)
    expect(mockService.rename).toHaveBeenCalledWith(USER_ID, LIST_ID, "Nouveau")
    expect(result).toEqual({ ...mockList, name: "Nouveau" })
  })

  it("addRecipe should delegate to service", async () => {
    mockService.addRecipe.mockResolvedValue(mockList)
    const dto = { recipeId: "recipe123" }
    const result = await controller.addRecipe(USER_ID, LIST_ID, dto as never)
    expect(mockService.addRecipe).toHaveBeenCalledWith(USER_ID, LIST_ID, dto)
    expect(result).toBe(mockList)
  })

  it("toggleItem should delegate to service", async () => {
    mockService.toggleItem.mockResolvedValue(mockList)
    const result = await controller.toggleItem(USER_ID, LIST_ID, ITEM_ID, {
      checked: true
    } as never)
    expect(mockService.toggleItem).toHaveBeenCalledWith(
      USER_ID,
      LIST_ID,
      ITEM_ID,
      true
    )
    expect(result).toBe(mockList)
  })

  it("remove should delegate to service", async () => {
    mockService.remove.mockResolvedValue({ message: "Liste supprimée" })
    const result = await controller.remove(USER_ID, LIST_ID)
    expect(mockService.remove).toHaveBeenCalledWith(USER_ID, LIST_ID)
    expect(result).toEqual({ message: "Liste supprimée" })
  })
})
