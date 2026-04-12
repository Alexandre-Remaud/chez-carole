import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus
} from "@nestjs/common"
import { ShoppingListsService } from "./shopping-lists.service"
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto"
import { AddRecipeDto } from "./dto/add-recipe.dto"
import { UpdateNameDto } from "./dto/update-name.dto"
import { ToggleItemDto } from "./dto/toggle-item.dto"
import { CurrentUser } from "../auth/decorators/current-user.decorator"

@Controller("shopping-lists")
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  create(
    @CurrentUser("sub") userId: string,
    @Body() dto: CreateShoppingListDto
  ) {
    return this.shoppingListsService.create(userId, dto)
  }

  @Get()
  findAll(@CurrentUser("sub") userId: string) {
    return this.shoppingListsService.findAll(userId)
  }

  @Get(":id")
  findOne(@CurrentUser("sub") userId: string, @Param("id") listId: string) {
    return this.shoppingListsService.findOne(userId, listId)
  }

  @Patch(":id")
  rename(
    @CurrentUser("sub") userId: string,
    @Param("id") listId: string,
    @Body() dto: UpdateNameDto
  ) {
    return this.shoppingListsService.rename(userId, listId, dto.name)
  }

  @Post(":id/recipes")
  addRecipe(
    @CurrentUser("sub") userId: string,
    @Param("id") listId: string,
    @Body() dto: AddRecipeDto
  ) {
    return this.shoppingListsService.addRecipe(userId, listId, dto)
  }

  @Patch(":id/items/:itemId")
  toggleItem(
    @CurrentUser("sub") userId: string,
    @Param("id") listId: string,
    @Param("itemId") itemId: string,
    @Body() dto: ToggleItemDto
  ) {
    return this.shoppingListsService.toggleItem(
      userId,
      listId,
      itemId,
      dto.checked
    )
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser("sub") userId: string, @Param("id") listId: string) {
    return this.shoppingListsService.remove(userId, listId)
  }
}
