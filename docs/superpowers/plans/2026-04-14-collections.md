# Collections / Carnets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow authenticated users to organise recipes into named collections, share them publicly via URL, and add recipes from the recipe detail page via a modal.

**Architecture:** New `collections/` NestJS module (entity + service + controller + DTOs) registered in `AppModule`. Frontend feature folder `src/features/collections/` with contract/api/hooks/components, two new routes (`/collections`, `/collections/$collectionId`), and an `AddToCollectionButton` on the recipe detail page.

**Tech Stack:** NestJS, Mongoose, class-validator, React 19, TanStack Router, Vitest, Jest.

---

## File Map

### Backend — create
- `backend/src/collections/entities/collection.entity.ts` — Mongoose schema
- `backend/src/collections/dto/create-collection.dto.ts`
- `backend/src/collections/dto/update-collection.dto.ts`
- `backend/src/collections/dto/get-collections.dto.ts`
- `backend/src/collections/collections.service.ts`
- `backend/src/collections/collections.service.spec.ts`
- `backend/src/collections/collections.controller.ts`
- `backend/src/collections/collections.controller.spec.ts`
- `backend/src/collections/collections.module.ts`

### Backend — modify
- `backend/src/app.module.ts` — register `CollectionsModule`

### Frontend — create
- `frontend/src/features/collections/contract.ts`
- `frontend/src/features/collections/api.ts`
- `frontend/src/features/collections/api.test.ts`
- `frontend/src/features/collections/hooks.ts`
- `frontend/src/features/collections/components/CollectionCard.tsx`
- `frontend/src/features/collections/components/CollectionForm.tsx`
- `frontend/src/features/collections/components/AddToCollectionModal.tsx`
- `frontend/src/features/collections/components/AddToCollectionButton.tsx`
- `frontend/src/pages/Collections.tsx`
- `frontend/src/pages/CollectionDetail.tsx`
- `frontend/src/routes/collections/index.tsx`
- `frontend/src/routes/collections/$collectionId.tsx`

### Frontend — modify
- Recipe detail component (add `AddToCollectionButton` alongside existing action buttons)

---

## Task 1 — Collection entity

**Files:**
- Create: `backend/src/collections/entities/collection.entity.ts`

- [ ] **Step 1: Create the entity file**

```typescript
// backend/src/collections/entities/collection.entity.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type CollectionDocument = HydratedDocument<Collection>

@Schema({ timestamps: true })
export class Collection {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @Prop({ required: true, maxlength: 100 })
  name: string

  @Prop({ maxlength: 500 })
  description?: string

  @Prop({ default: false })
  isPublic: boolean

  @Prop({ type: [{ type: Types.ObjectId, ref: "Recipe" }], default: [] })
  recipeIds: Types.ObjectId[]

  @Prop()
  coverImage?: string

  createdAt: Date
  updatedAt: Date
}

export const CollectionSchema = SchemaFactory.createForClass(Collection)

CollectionSchema.index({ userId: 1 })
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/collections/entities/collection.entity.ts
git commit -m "feat(collections): add Collection entity"
```

---

## Task 2 — DTOs

**Files:**
- Create: `backend/src/collections/dto/create-collection.dto.ts`
- Create: `backend/src/collections/dto/update-collection.dto.ts`
- Create: `backend/src/collections/dto/get-collections.dto.ts`

- [ ] **Step 1: Create DTOs**

```typescript
// backend/src/collections/dto/create-collection.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsNotEmpty
} from "class-validator"

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean
}
```

```typescript
// backend/src/collections/dto/update-collection.dto.ts
import { IsString, IsOptional, IsBoolean, MaxLength, IsUrl } from "class-validator"

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @IsUrl()
  coverImage?: string
}
```

```typescript
// backend/src/collections/dto/get-collections.dto.ts
import { IsOptional, IsString } from "class-validator"

export class GetCollectionsDto {
  @IsOptional()
  @IsString()
  skip?: string

  @IsOptional()
  @IsString()
  limit?: string
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/collections/dto/
git commit -m "feat(collections): add DTOs"
```

---

## Task 3 — CollectionsService + tests

**Files:**
- Create: `backend/src/collections/collections.service.ts`
- Create: `backend/src/collections/collections.service.spec.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// backend/src/collections/collections.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import {
  NotFoundException,
  ConflictException,
  ForbiddenException
} from "@nestjs/common"
import { Types } from "mongoose"
import { CollectionsService } from "./collections.service"
import { Collection } from "./entities/collection.entity"
import { Recipe } from "../recipes/entities/recipe.entity"

const USER_ID = "507f1f77bcf86cd799439011"
const OTHER_ID = "507f1f77bcf86cd799439099"
const RECIPE_ID = "507f1f77bcf86cd799439012"
const COLL_ID = "507f1f77bcf86cd799439013"

const mockCollection = {
  _id: new Types.ObjectId(COLL_ID),
  userId: new Types.ObjectId(USER_ID),
  name: "Ma collection",
  description: undefined,
  isPublic: false,
  recipeIds: [],
  coverImage: undefined,
  save: jest.fn().mockResolvedValue(undefined),
  toObject: jest.fn().mockReturnThis()
}

const mockRecipe = { _id: new Types.ObjectId(RECIPE_ID) }

const mockCollectionModel = {
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findByIdAndDelete: jest.fn()
}

const mockRecipeModel = {
  findById: jest.fn(),
  find: jest.fn()
}

describe("CollectionsService", () => {
  let service: CollectionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        { provide: getModelToken(Collection.name), useValue: mockCollectionModel },
        { provide: getModelToken(Recipe.name), useValue: mockRecipeModel }
      ]
    }).compile()
    service = module.get<CollectionsService>(CollectionsService)
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("should create and return a collection", async () => {
      mockCollectionModel.create.mockResolvedValue(mockCollection)
      const result = await service.create(USER_ID, { name: "Ma collection" })
      expect(mockCollectionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Ma collection" })
      )
      expect(result).toBe(mockCollection)
    })
  })

  describe("findMine", () => {
    it("should return paginated user collections", async () => {
      mockCollectionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockCollection])
      })
      mockCollectionModel.countDocuments.mockResolvedValue(1)
      const result = await service.findMine(USER_ID, 0, 20)
      expect(result).toEqual({ data: [mockCollection], total: 1 })
    })
  })

  describe("findOne", () => {
    it("should return collection if public", async () => {
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockCollection, isPublic: true })
      })
      mockRecipeModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockRecipe])
      })
      const result = await service.findOne(COLL_ID, undefined)
      expect(result).toBeDefined()
    })

    it("should throw 403 if private and not owner", async () => {
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockCollection, isPublic: false })
      })
      await expect(service.findOne(COLL_ID, OTHER_ID)).rejects.toThrow(
        ForbiddenException
      )
    })

    it("should throw 404 if not found", async () => {
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      })
      await expect(service.findOne(COLL_ID, USER_ID)).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("update", () => {
    it("should throw 403 if not owner", async () => {
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCollection)
      })
      await expect(
        service.update(COLL_ID, OTHER_ID, { name: "X" })
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe("remove", () => {
    it("should throw 403 if not owner", async () => {
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCollection)
      })
      await expect(service.remove(COLL_ID, OTHER_ID)).rejects.toThrow(
        ForbiddenException
      )
    })
  })

  describe("addRecipe", () => {
    it("should throw 409 if recipe already in collection", async () => {
      const collWithRecipe = {
        ...mockCollection,
        recipeIds: [new Types.ObjectId(RECIPE_ID)],
        save: jest.fn()
      }
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(collWithRecipe)
      })
      mockRecipeModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRecipe)
      })
      await expect(service.addRecipe(COLL_ID, USER_ID, RECIPE_ID)).rejects.toThrow(
        ConflictException
      )
    })
  })

  describe("removeRecipe", () => {
    it("should remove recipe from collection", async () => {
      const collWithRecipe = {
        ...mockCollection,
        recipeIds: [new Types.ObjectId(RECIPE_ID)],
        save: jest.fn().mockResolvedValue(undefined)
      }
      mockCollectionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(collWithRecipe)
      })
      mockRecipeModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      })
      await service.removeRecipe(COLL_ID, USER_ID, RECIPE_ID)
      expect(collWithRecipe.save).toHaveBeenCalled()
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && pnpm test -- --testPathPattern=collections.service
```

Expected: FAIL (CollectionsService not found)

- [ ] **Step 3: Implement the service**

```typescript
// backend/src/collections/collections.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types, isValidObjectId } from "mongoose"
import { Collection } from "./entities/collection.entity"
import { Recipe } from "../recipes/entities/recipe.entity"
import { CreateCollectionDto } from "./dto/create-collection.dto"
import { UpdateCollectionDto } from "./dto/update-collection.dto"

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>
  ) {}

  private validateObjectId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid ID format")
    }
  }

  async create(userId: string, dto: CreateCollectionDto) {
    return this.collectionModel.create({
      userId: new Types.ObjectId(userId),
      name: dto.name,
      description: dto.description,
      isPublic: dto.isPublic ?? false
    })
  }

  async findMine(userId: string, skip = 0, limit = 20) {
    const safeSkip = Math.max(0, skip)
    const safeLimit = Math.min(Math.max(1, limit), 100)
    const filter = { userId: new Types.ObjectId(userId) }
    const [data, total] = await Promise.all([
      this.collectionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(safeSkip)
        .limit(safeLimit)
        .exec(),
      this.collectionModel.countDocuments(filter)
    ])
    return { data, total }
  }

  async findOne(collectionId: string, requestUserId: string | undefined) {
    this.validateObjectId(collectionId)
    const collection = await this.collectionModel
      .findById(collectionId)
      .exec()
    if (!collection) throw new NotFoundException("Collection not found")

    const isOwner = requestUserId && collection.userId.toString() === requestUserId
    if (!collection.isPublic && !isOwner) {
      throw new ForbiddenException("Collection is private")
    }

    const recipes = await this.recipeModel
      .find({ _id: { $in: collection.recipeIds } })
      .exec()

    const recipeMap = new Map(recipes.map((r) => [r._id.toString(), r]))
    const orderedRecipes = collection.recipeIds
      .map((id) => recipeMap.get(id.toString()))
      .filter(Boolean)

    return { ...collection.toObject(), recipes: orderedRecipes }
  }

  async update(collectionId: string, userId: string, dto: UpdateCollectionDto) {
    this.validateObjectId(collectionId)
    const collection = await this.collectionModel.findById(collectionId).exec()
    if (!collection) throw new NotFoundException("Collection not found")
    if (collection.userId.toString() !== userId) {
      throw new ForbiddenException("Not the owner")
    }

    if (dto.name !== undefined) collection.name = dto.name
    if (dto.description !== undefined) collection.description = dto.description
    if (dto.isPublic !== undefined) collection.isPublic = dto.isPublic
    if (dto.coverImage !== undefined) collection.coverImage = dto.coverImage

    await collection.save()
    return collection
  }

  async remove(collectionId: string, userId: string) {
    this.validateObjectId(collectionId)
    const collection = await this.collectionModel.findById(collectionId).exec()
    if (!collection) throw new NotFoundException("Collection not found")
    if (collection.userId.toString() !== userId) {
      throw new ForbiddenException("Not the owner")
    }
    await this.collectionModel.findByIdAndDelete(collectionId).exec()
    return { deleted: true }
  }

  async addRecipe(collectionId: string, userId: string, recipeId: string) {
    this.validateObjectId(collectionId)
    this.validateObjectId(recipeId)

    const [collection, recipe] = await Promise.all([
      this.collectionModel.findById(collectionId).exec(),
      this.recipeModel.findById(recipeId).exec()
    ])

    if (!collection) throw new NotFoundException("Collection not found")
    if (!recipe) throw new NotFoundException("Recipe not found")
    if (collection.userId.toString() !== userId) {
      throw new ForbiddenException("Not the owner")
    }

    const alreadyIn = collection.recipeIds.some(
      (id) => id.toString() === recipeId
    )
    if (alreadyIn) throw new ConflictException("Recipe already in collection")

    collection.recipeIds.push(new Types.ObjectId(recipeId))
    await collection.save()

    const recipes = await this.recipeModel
      .find({ _id: { $in: collection.recipeIds } })
      .exec()
    const recipeMap = new Map(recipes.map((r) => [r._id.toString(), r]))
    const orderedRecipes = collection.recipeIds
      .map((id) => recipeMap.get(id.toString()))
      .filter(Boolean)

    return { ...collection.toObject(), recipes: orderedRecipes }
  }

  async removeRecipe(collectionId: string, userId: string, recipeId: string) {
    this.validateObjectId(collectionId)
    this.validateObjectId(recipeId)

    const collection = await this.collectionModel.findById(collectionId).exec()
    if (!collection) throw new NotFoundException("Collection not found")
    if (collection.userId.toString() !== userId) {
      throw new ForbiddenException("Not the owner")
    }

    collection.recipeIds = collection.recipeIds.filter(
      (id) => id.toString() !== recipeId
    )
    await collection.save()

    const recipes = await this.recipeModel
      .find({ _id: { $in: collection.recipeIds } })
      .exec()
    const recipeMap = new Map(recipes.map((r) => [r._id.toString(), r]))
    const orderedRecipes = collection.recipeIds
      .map((id) => recipeMap.get(id.toString()))
      .filter(Boolean)

    return { ...collection.toObject(), recipes: orderedRecipes }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && pnpm test -- --testPathPattern=collections.service
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/collections/collections.service.ts backend/src/collections/collections.service.spec.ts
git commit -m "feat(collections): add CollectionsService with tests"
```

---

## Task 4 — CollectionsController + tests

**Files:**
- Create: `backend/src/collections/collections.controller.ts`
- Create: `backend/src/collections/collections.controller.spec.ts`

- [ ] **Step 1: Write failing controller tests**

```typescript
// backend/src/collections/collections.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing"
import { CollectionsController } from "./collections.controller"
import { CollectionsService } from "./collections.service"

const mockService = {
  create: jest.fn(),
  findMine: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addRecipe: jest.fn(),
  removeRecipe: jest.fn()
}

describe("CollectionsController", () => {
  let controller: CollectionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionsController],
      providers: [{ provide: CollectionsService, useValue: mockService }]
    }).compile()
    controller = module.get<CollectionsController>(CollectionsController)
    jest.clearAllMocks()
  })

  it("create should call service.create", async () => {
    mockService.create.mockResolvedValue({ _id: "c1", name: "Test" })
    const result = await controller.create("user1", { name: "Test" })
    expect(mockService.create).toHaveBeenCalledWith("user1", { name: "Test" })
    expect(result).toEqual({ _id: "c1", name: "Test" })
  })

  it("findMine should call service.findMine", async () => {
    mockService.findMine.mockResolvedValue({ data: [], total: 0 })
    const result = await controller.findMine("user1", {})
    expect(mockService.findMine).toHaveBeenCalledWith("user1", 0, 20)
    expect(result).toEqual({ data: [], total: 0 })
  })

  it("findOne should call service.findOne", async () => {
    mockService.findOne.mockResolvedValue({ _id: "c1" })
    await controller.findOne("c1", "user1")
    expect(mockService.findOne).toHaveBeenCalledWith("c1", "user1")
  })

  it("addRecipe should call service.addRecipe", async () => {
    mockService.addRecipe.mockResolvedValue({ _id: "c1" })
    await controller.addRecipe("c1", "user1", { recipeId: "r1" })
    expect(mockService.addRecipe).toHaveBeenCalledWith("c1", "user1", "r1")
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && pnpm test -- --testPathPattern=collections.controller
```

Expected: FAIL (CollectionsController not found)

- [ ] **Step 3: Implement the controller**

```typescript
// backend/src/collections/collections.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Optional
} from "@nestjs/common"
import { CollectionsService } from "./collections.service"
import { CreateCollectionDto } from "./dto/create-collection.dto"
import { UpdateCollectionDto } from "./dto/update-collection.dto"
import { GetCollectionsDto } from "./dto/get-collections.dto"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { Public } from "../auth/decorators/public.decorator"

@Controller("collections")
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(
    @CurrentUser("sub") userId: string,
    @Body() dto: CreateCollectionDto
  ) {
    return this.collectionsService.create(userId, dto)
  }

  @Get("me")
  findMine(
    @CurrentUser("sub") userId: string,
    @Query() query: GetCollectionsDto
  ) {
    const skip = query.skip ? parseInt(query.skip, 10) : 0
    const limit = query.limit ? parseInt(query.limit, 10) : 20
    return this.collectionsService.findMine(userId, skip, limit)
  }

  @Public()
  @Get(":id")
  findOne(
    @Param("id") collectionId: string,
    @CurrentUser("sub") userId: string | undefined
  ) {
    return this.collectionsService.findOne(collectionId, userId)
  }

  @Patch(":id")
  update(
    @Param("id") collectionId: string,
    @CurrentUser("sub") userId: string,
    @Body() dto: UpdateCollectionDto
  ) {
    return this.collectionsService.update(collectionId, userId, dto)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(
    @Param("id") collectionId: string,
    @CurrentUser("sub") userId: string
  ) {
    return this.collectionsService.remove(collectionId, userId)
  }

  @Post(":id/recipes")
  addRecipe(
    @Param("id") collectionId: string,
    @CurrentUser("sub") userId: string,
    @Body() body: { recipeId: string }
  ) {
    return this.collectionsService.addRecipe(collectionId, userId, body.recipeId)
  }

  @Delete(":id/recipes/:recipeId")
  @HttpCode(HttpStatus.OK)
  removeRecipe(
    @Param("id") collectionId: string,
    @CurrentUser("sub") userId: string,
    @Param("recipeId") recipeId: string
  ) {
    return this.collectionsService.removeRecipe(collectionId, userId, recipeId)
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && pnpm test -- --testPathPattern=collections.controller
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/collections/collections.controller.ts backend/src/collections/collections.controller.spec.ts
git commit -m "feat(collections): add CollectionsController with tests"
```

---

## Task 5 — Module + AppModule registration

**Files:**
- Create: `backend/src/collections/collections.module.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Create the module**

```typescript
// backend/src/collections/collections.module.ts
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CollectionsService } from "./collections.service"
import { CollectionsController } from "./collections.controller"
import { Collection, CollectionSchema } from "./entities/collection.entity"
import { Recipe, RecipeSchema } from "../recipes/entities/recipe.entity"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
      { name: Recipe.name, schema: RecipeSchema }
    ])
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService]
})
export class CollectionsModule {}
```

- [ ] **Step 2: Register in AppModule**

In `backend/src/app.module.ts`, add the import:

```typescript
import { CollectionsModule } from "./collections/collections.module"
```

And add `CollectionsModule` to the `imports` array (after `ShoppingListsModule`).

- [ ] **Step 3: Run all backend tests**

```bash
cd backend && pnpm test
```

Expected: All tests PASS

- [ ] **Step 4: Start dev server and verify endpoints respond**

```bash
cd backend && pnpm start:dev
```

Then in another terminal:
```bash
curl -s http://localhost:5000/collections/me  # expects 401 (no cookie)
curl -s http://localhost:5000/collections/nonexistentid  # expects 400 (invalid ID)
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/collections/collections.module.ts backend/src/app.module.ts
git commit -m "feat(collections): register CollectionsModule in AppModule"
```

---

## Task 6 — Frontend contract + api + api tests

**Files:**
- Create: `frontend/src/features/collections/contract.ts`
- Create: `frontend/src/features/collections/api.ts`
- Create: `frontend/src/features/collections/api.test.ts`

- [ ] **Step 1: Write the contract (types)**

```typescript
// frontend/src/features/collections/contract.ts
export interface Collection {
  _id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  recipeIds: string[]
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface CollectionDetail extends Collection {
  recipes: CollectionRecipe[]
}

export interface CollectionRecipe {
  _id: string
  title: string
  imageUrl?: string
  thumbnailUrl?: string
  category?: string
  servings?: number
}

export interface CollectionsResponse {
  data: Collection[]
  total: number
}

export interface CreateCollectionPayload {
  name: string
  description?: string
  isPublic?: boolean
}

export interface UpdateCollectionPayload {
  name?: string
  description?: string
  isPublic?: boolean
  coverImage?: string
}
```

- [ ] **Step 2: Write failing api tests**

```typescript
// frontend/src/features/collections/api.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import { collectionsApi } from "./api"

vi.mock("@/lib/api-client", () => ({
  apiFetch: vi.fn()
}))

import { apiFetch } from "@/lib/api-client"

const mockFetch = vi.mocked(apiFetch)

const mockCollection = {
  _id: "c1",
  userId: "u1",
  name: "Ma collection",
  isPublic: false,
  recipeIds: [],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01"
}

describe("collectionsApi", () => {
  beforeEach(() => vi.clearAllMocks())

  it("create should POST to /collections", async () => {
    mockFetch.mockResolvedValue(mockCollection)
    await collectionsApi.create({ name: "Ma collection" })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections"),
      expect.objectContaining({ method: "POST" })
    )
  })

  it("getMine should GET /collections/me", async () => {
    mockFetch.mockResolvedValue({ data: [mockCollection], total: 1 })
    await collectionsApi.getMine()
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections/me"),
      expect.objectContaining({ method: "GET" })
    )
  })

  it("getOne should GET /collections/:id", async () => {
    mockFetch.mockResolvedValue({ ...mockCollection, recipes: [] })
    await collectionsApi.getOne("c1")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections/c1"),
      expect.objectContaining({ method: "GET" })
    )
  })

  it("update should PATCH /collections/:id", async () => {
    mockFetch.mockResolvedValue(mockCollection)
    await collectionsApi.update("c1", { name: "Nouveau" })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections/c1"),
      expect.objectContaining({ method: "PATCH" })
    )
  })

  it("remove should DELETE /collections/:id", async () => {
    mockFetch.mockResolvedValue({ deleted: true })
    await collectionsApi.remove("c1")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections/c1"),
      expect.objectContaining({ method: "DELETE" })
    )
  })

  it("addRecipe should POST to /collections/:id/recipes", async () => {
    mockFetch.mockResolvedValue({ ...mockCollection, recipes: [] })
    await collectionsApi.addRecipe("c1", "r1")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections/c1/recipes"),
      expect.objectContaining({ method: "POST" })
    )
  })

  it("removeRecipe should DELETE /collections/:id/recipes/:recipeId", async () => {
    mockFetch.mockResolvedValue({ ...mockCollection, recipes: [] })
    await collectionsApi.removeRecipe("c1", "r1")
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections/c1/recipes/r1"),
      expect.objectContaining({ method: "DELETE" })
    )
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd frontend && pnpm test -- src/features/collections/api.test.ts
```

Expected: FAIL (collectionsApi not found)

- [ ] **Step 4: Implement the api module**

```typescript
// frontend/src/features/collections/api.ts
import { apiFetch } from "@/lib/api-client"
import type {
  Collection,
  CollectionDetail,
  CollectionsResponse,
  CreateCollectionPayload,
  UpdateCollectionPayload
} from "./contract"

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/collections`

export const collectionsApi = {
  async create(payload: CreateCollectionPayload): Promise<Collection> {
    return apiFetch<Collection>(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
  },

  async getMine(): Promise<CollectionsResponse> {
    return apiFetch<CollectionsResponse>(`${BASE}/me`, {
      method: "GET",
      credentials: "include"
    })
  },

  async getOne(collectionId: string): Promise<CollectionDetail> {
    return apiFetch<CollectionDetail>(`${BASE}/${collectionId}`, {
      method: "GET",
      credentials: "include"
    })
  },

  async update(
    collectionId: string,
    payload: UpdateCollectionPayload
  ): Promise<Collection> {
    return apiFetch<Collection>(`${BASE}/${collectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
  },

  async remove(collectionId: string): Promise<{ deleted: boolean }> {
    return apiFetch<{ deleted: boolean }>(`${BASE}/${collectionId}`, {
      method: "DELETE",
      credentials: "include"
    })
  },

  async addRecipe(
    collectionId: string,
    recipeId: string
  ): Promise<CollectionDetail> {
    return apiFetch<CollectionDetail>(`${BASE}/${collectionId}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipeId })
    })
  },

  async removeRecipe(
    collectionId: string,
    recipeId: string
  ): Promise<CollectionDetail> {
    return apiFetch<CollectionDetail>(
      `${BASE}/${collectionId}/recipes/${recipeId}`,
      {
        method: "DELETE",
        credentials: "include"
      }
    )
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd frontend && pnpm test -- src/features/collections/api.test.ts
```

Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/src/features/collections/contract.ts frontend/src/features/collections/api.ts frontend/src/features/collections/api.test.ts
git commit -m "feat(collections): add frontend contract, api, and api tests"
```

---

## Task 7 — Frontend hooks

**Files:**
- Create: `frontend/src/features/collections/hooks.ts`

- [ ] **Step 1: Implement hooks**

```typescript
// frontend/src/features/collections/hooks.ts
import { useState, useEffect, useCallback } from "react"
import { collectionsApi } from "./api"
import type { Collection, CollectionDetail } from "./contract"

export function useMyCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await collectionsApi.getMine()
      setCollections(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function createCollection(name: string, description?: string) {
    const created = await collectionsApi.create({ name, description })
    setCollections((prev) => [created, ...prev])
    return created
  }

  async function removeCollection(collectionId: string) {
    await collectionsApi.remove(collectionId)
    setCollections((prev) => prev.filter((c) => c._id !== collectionId))
  }

  async function addRecipeToCollection(collectionId: string, recipeId: string) {
    return collectionsApi.addRecipe(collectionId, recipeId)
  }

  return {
    collections,
    loading,
    error,
    createCollection,
    removeCollection,
    addRecipeToCollection,
    refresh: load
  }
}

export function useCollection(collectionId: string) {
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await collectionsApi.getOne(collectionId)
      setCollection(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [collectionId])

  useEffect(() => {
    void load()
  }, [load])

  async function updateCollection(payload: {
    name?: string
    description?: string
    isPublic?: boolean
    coverImage?: string
  }) {
    const updated = await collectionsApi.update(collectionId, payload)
    setCollection((prev) => (prev ? { ...prev, ...updated } : prev))
    return updated
  }

  async function removeRecipe(recipeId: string) {
    const updated = await collectionsApi.removeRecipe(collectionId, recipeId)
    setCollection(updated)
  }

  return { collection, loading, error, updateCollection, removeRecipe, refresh: load }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/collections/hooks.ts
git commit -m "feat(collections): add frontend hooks"
```

---

## Task 8 — CollectionCard component

**Files:**
- Create: `frontend/src/features/collections/components/CollectionCard.tsx`

- [ ] **Step 1: Implement CollectionCard**

```tsx
// frontend/src/features/collections/components/CollectionCard.tsx
import { Link } from "@tanstack/react-router"
import type { Collection } from "../contract"

interface Props {
  collection: Collection
}

export default function CollectionCard({ collection }: Props) {
  const recipeCount = collection.recipeIds.length

  return (
    <Link
      to="/collections/$collectionId"
      params={{ collectionId: collection._id }}
      className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-warm-300 transition-all duration-150 bg-white"
    >
      <div className="aspect-[4/3] bg-warm-50 relative overflow-hidden">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-200">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
            </svg>
          </div>
        )}
        {collection.isPublic && (
          <span className="absolute top-2 right-2 bg-white/90 text-warm-700 text-xs font-medium px-2 py-0.5 rounded-full">
            Publique
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-display font-semibold text-gray-800 truncate group-hover:text-warm-700 transition-colors">
          {collection.name}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {recipeCount} recette{recipeCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/collections/components/CollectionCard.tsx
git commit -m "feat(collections): add CollectionCard component"
```

---

## Task 9 — AddToCollectionModal + AddToCollectionButton

**Files:**
- Create: `frontend/src/features/collections/components/AddToCollectionModal.tsx`
- Create: `frontend/src/features/collections/components/AddToCollectionButton.tsx`

- [ ] **Step 1: Implement AddToCollectionModal**

```tsx
// frontend/src/features/collections/components/AddToCollectionModal.tsx
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useMyCollections } from "../hooks"

interface Props {
  recipeId: string
  recipeTitle: string
  onClose: () => void
}

export default function AddToCollectionModal({
  recipeId,
  recipeTitle,
  onClose
}: Props) {
  const { collections, loading, createCollection, addRecipeToCollection } =
    useMyCollections()
  const [view, setView] = useState<"select" | "create">("select")
  const [newName, setNewName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && collections.length === 0) setView("create")
  }, [loading, collections.length])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  async function handleAddToExisting(collectionId: string) {
    setSubmitting(true)
    try {
      await addRecipeToCollection(collectionId, recipeId)
      const name =
        collections.find((c) => c._id === collectionId)?.name ?? "la collection"
      toast.success(`Ajouté à ${name}`)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    try {
      const created = await createCollection(newName.trim())
      await addRecipeToCollection(created._id, recipeId)
      toast.success(`Collection "${newName.trim()}" créée`)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-collection-title"
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="add-to-collection-title"
            className="font-display text-lg font-semibold text-gray-800"
          >
            Collections
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4 truncate">
          <span className="font-medium text-gray-700">{recipeTitle}</span>
        </p>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Chargement...
          </p>
        ) : view === "select" ? (
          <div className="space-y-2">
            {collections.map((col) => {
              const alreadyIn = col.recipeIds.includes(recipeId)
              return (
                <button
                  key={col._id}
                  type="button"
                  onClick={() => !alreadyIn && handleAddToExisting(col._id)}
                  disabled={submitting || alreadyIn}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-warm-300 hover:bg-warm-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-default"
                >
                  <p className="text-sm font-medium text-gray-800">{col.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {alreadyIn
                      ? "Déjà dans cette collection"
                      : `${col.recipeIds.length} recette${col.recipeIds.length !== 1 ? "s" : ""}`}
                  </p>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setView("create")}
              className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-gray-200 hover:border-warm-400 hover:bg-warm-50 transition-all duration-150 text-sm text-gray-500 hover:text-warm-600 flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Créer une nouvelle collection
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            {collections.length > 0 && (
              <button
                type="button"
                onClick={() => setView("select")}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-1"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Retour
              </button>
            )}
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom de la collection"
              maxLength={100}
              autoFocus
              className="input-field"
            />
            <button
              type="submit"
              disabled={submitting || !newName.trim()}
              className="w-full py-2.5 text-sm font-medium text-white bg-warm-600 rounded-xl hover:bg-warm-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Création..." : "Créer et ajouter"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement AddToCollectionButton**

```tsx
// frontend/src/features/collections/components/AddToCollectionButton.tsx
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/features/auth/hooks"
import AddToCollectionModal from "./AddToCollectionModal"

interface Props {
  recipe: { _id: string; title: string }
}

export default function AddToCollectionButton({ recipe }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  function handleClick() {
    if (!user) {
      void navigate({ to: "/login" })
      return
    }
    setModalOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-warm-600 cursor-pointer transition-colors"
        aria-label="Ajouter à une collection"
        title={
          !user
            ? "Connectez-vous pour utiliser les collections"
            : "Ajouter à une collection"
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
        </svg>
      </button>

      {modalOpen && (
        <AddToCollectionModal
          recipeId={recipe._id}
          recipeTitle={recipe.title}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/collections/components/
git commit -m "feat(collections): add AddToCollectionModal and AddToCollectionButton"
```

---

## Task 10 — Collections list page + route

**Files:**
- Create: `frontend/src/pages/Collections.tsx`
- Create: `frontend/src/routes/collections/index.tsx`

- [ ] **Step 1: Create the page**

```tsx
// frontend/src/pages/Collections.tsx
import { useState } from "react"
import { useMyCollections } from "@/features/collections/hooks"
import CollectionCard from "@/features/collections/components/CollectionCard"
import { collectionsApi } from "@/features/collections/api"
import toast from "react-hot-toast"

export default function Collections() {
  const { collections, loading, error, refresh } = useMyCollections()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    try {
      await collectionsApi.create({ name: newName.trim() })
      setNewName("")
      setCreating(false)
      toast.success("Collection créée")
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-gray-400 text-sm">
        Chargement...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-red-500 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-warm-400" />
          <h1 className="font-display text-2xl font-bold text-gray-800">
            Mes collections
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 text-sm font-medium text-warm-600 hover:text-warm-700 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouvelle collection
        </button>
      </div>

      {creating && (
        <form
          onSubmit={handleCreate}
          className="mb-6 flex items-center gap-3 p-4 bg-warm-50 rounded-2xl"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom de la collection"
            maxLength={100}
            autoFocus
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={submitting || !newName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-warm-600 rounded-xl hover:bg-warm-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : "Créer"}
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Annuler
          </button>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto mb-4 text-warm-200"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 text-sm mb-1">Aucune collection</p>
          <p className="text-gray-400 text-xs">
            Créez votre première collection depuis une fiche recette.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {collections.map((col) => (
            <CollectionCard key={col._id} collection={col} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create the route**

```typescript
// frontend/src/routes/collections/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import Collections from "@/pages/Collections"

export const Route = createFileRoute("/collections/")({
  component: Collections
})
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Collections.tsx frontend/src/routes/collections/index.tsx
git commit -m "feat(collections): add collections list page and route"
```

---

## Task 11 — Collection detail page + route

**Files:**
- Create: `frontend/src/pages/CollectionDetail.tsx`
- Create: `frontend/src/routes/collections/$collectionId.tsx`

- [ ] **Step 1: Create the detail page**

```tsx
// frontend/src/pages/CollectionDetail.tsx
import { useParams } from "@tanstack/react-router"
import { useCollection } from "@/features/collections/hooks"
import { useAuth } from "@/features/auth/hooks"
import { Link } from "@tanstack/react-router"
import toast from "react-hot-toast"

export default function CollectionDetail() {
  const { collectionId } = useParams({ from: "/collections/$collectionId" })
  const { collection, loading, error, removeRecipe, updateCollection } =
    useCollection(collectionId)
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-gray-400 text-sm">
        Chargement...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-red-500 text-sm">
        {error}
      </div>
    )
  }

  if (!collection) return null

  const isOwner = user?._id === collection.userId

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Lien copié !")
  }

  async function handleTogglePublic() {
    try {
      await updateCollection({ isPublic: !collection!.isPublic })
      toast.success(
        collection!.isPublic ? "Collection rendue privée" : "Collection rendue publique"
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    }
  }

  async function handleRemoveRecipe(recipeId: string) {
    try {
      await removeRecipe(recipeId)
      toast.success("Recette retirée de la collection")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover image */}
      {collection.coverImage && (
        <div className="aspect-[3/1] rounded-2xl overflow-hidden mb-6">
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-6 h-px bg-warm-400" />
            <h1 className="font-display text-2xl font-bold text-gray-800">
              {collection.name}
            </h1>
            {collection.isPublic && (
              <span className="text-xs font-medium text-warm-700 bg-warm-100 px-2 py-0.5 rounded-full">
                Publique
              </span>
            )}
          </div>
          {collection.description && (
            <p className="text-sm text-gray-500 ml-9">{collection.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              type="button"
              onClick={handleTogglePublic}
              className="text-xs text-gray-400 hover:text-warm-600 transition-colors"
            >
              {collection.isPublic ? "Rendre privée" : "Rendre publique"}
            </button>
          )}
          {collection.isPublic && (
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-warm-600 transition-colors"
              aria-label="Partager"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              Partager
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 ml-9 mb-6">
        {collection.recipes.length} recette{collection.recipes.length !== 1 ? "s" : ""}
      </p>

      {/* Recipe grid */}
      {collection.recipes.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Aucune recette dans cette collection.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {collection.recipes.map((recipe) => (
            <div key={recipe._id} className="relative group">
              <Link
                to="/recipes/$id"
                params={{ id: recipe._id }}
                className="block rounded-2xl overflow-hidden border border-gray-100 hover:border-warm-300 transition-all duration-150 bg-white"
              >
                <div className="aspect-[4/3] bg-warm-50 overflow-hidden">
                  {recipe.thumbnailUrl || recipe.imageUrl ? (
                    <img
                      src={recipe.thumbnailUrl ?? recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-200">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                        <path d="M12 8v4l3 3" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {recipe.title}
                  </p>
                </div>
              </Link>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => handleRemoveRecipe(recipe._id)}
                  className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Retirer de la collection"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create the route**

```typescript
// frontend/src/routes/collections/$collectionId.tsx
import { createFileRoute } from "@tanstack/react-router"
import CollectionDetail from "@/pages/CollectionDetail"

export const Route = createFileRoute("/collections/$collectionId")({
  component: CollectionDetail
})
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/CollectionDetail.tsx frontend/src/routes/collections/$collectionId.tsx
git commit -m "feat(collections): add collection detail page and route"
```

---

## Task 11b — Cover image upload in CollectionDetail (owner)

**Files:**
- Modify: `frontend/src/pages/CollectionDetail.tsx`

Upload flow: owner clicks "Changer l'image" → file input opens → `POST /upload/image` (multipart) → get `originalUrl` → `PATCH /collections/:id` with `{ coverImage: originalUrl }`.

- [ ] **Step 1: Add upload handler and UI to CollectionDetail**

In `frontend/src/pages/CollectionDetail.tsx`, add the following inside the component (after the existing `handleRemoveRecipe` function):

```tsx
const UPLOAD_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/upload/image`

async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return
  const formData = new FormData()
  formData.append("file", file)
  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      credentials: "include",
      body: formData
    })
    if (!res.ok) throw new Error("Erreur d'upload")
    const data = (await res.json()) as { originalUrl: string }
    await updateCollection({ coverImage: data.originalUrl })
    toast.success("Image de couverture mise à jour")
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Erreur upload")
  }
}
```

Then in the JSX, replace the cover image section:

```tsx
{/* Cover image */}
<div className="aspect-[3/1] rounded-2xl overflow-hidden mb-6 bg-warm-50 relative group">
  {(collection.coverImage ?? collection.recipes[0]?.imageUrl) ? (
    <img
      src={collection.coverImage ?? collection.recipes[0]?.imageUrl}
      alt={collection.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-warm-200">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
      </svg>
    </div>
  )}
  {isOwner && (
    <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all cursor-pointer">
      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Changer l'image
      </span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleCoverUpload}
      />
    </label>
  )}
</div>
```

- [ ] **Step 2: Verify in browser**

Navigate to a collection you own. Hover the cover area → "Changer l'image" appears. Upload a JPEG/PNG/WebP → image updates. If no cover, first recipe image shows as fallback.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/CollectionDetail.tsx
git commit -m "feat(collections): add cover image upload to collection detail"
```

---

## Task 12 — Add AddToCollectionButton to recipe detail

**Files:**
- Modify: recipe detail component (find by running `grep -r "AddToListButton" frontend/src --include="*.tsx" -l`)

- [ ] **Step 1: Locate the recipe detail component**

```bash
grep -r "AddToListButton" frontend/src --include="*.tsx" -l
```

Note the file path returned (likely `frontend/src/features/recipes/RecipeDetail.tsx` or similar).

- [ ] **Step 2: Add the import and button**

In the recipe detail component, import `AddToCollectionButton`:

```tsx
import AddToCollectionButton from "@/features/collections/components/AddToCollectionButton"
```

Then place `<AddToCollectionButton recipe={{ _id: recipe._id, title: recipe.title }} />` alongside `AddToListButton` in the action buttons row.

- [ ] **Step 3: Verify in browser**

Start the dev server:
```bash
cd frontend && pnpm dev
```

Navigate to any recipe detail page. Confirm the new collection icon appears next to the shopping list icon. Click it — if not logged in, should redirect to `/login`. If logged in, should open `AddToCollectionModal`.

- [ ] **Step 4: Commit**

```bash
git add <recipe-detail-file>
git commit -m "feat(collections): add AddToCollectionButton to recipe detail"
```

---

## Task 13 — Add nav link to /collections

**Files:**
- Modify: root layout / nav component (find by running `grep -r "shopping-lists" frontend/src --include="*.tsx" -l`)

- [ ] **Step 1: Locate the nav component**

```bash
grep -r "shopping-lists" frontend/src --include="*.tsx" -l
```

Note the file(s) — likely the root layout or a `Nav` / `Header` component.

- [ ] **Step 2: Add collections nav link**

In the nav component, import and add a `Link` to `/collections` for authenticated users, following the same pattern as the existing shopping lists link (cart icon). Use a folder/bookmark icon for collections:

```tsx
<Link
  to="/collections"
  className="inline-flex items-center text-gray-400 hover:text-warm-600 transition-colors"
  aria-label="Mes collections"
  title="Mes collections"
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
  </svg>
</Link>
```

- [ ] **Step 3: Verify in browser**

Check the nav shows the collections icon for authenticated users. Click it — should navigate to `/collections`.

- [ ] **Step 4: Run frontend tests**

```bash
cd frontend && pnpm test
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add <nav-component-file>
git commit -m "feat(collections): add collections link to nav"
```

---

## Task 14 — Final verification

- [ ] **Step 1: Run all tests**

```bash
cd /path/to/project && pnpm test
```

Expected: All backend (Jest) and frontend (Vitest) tests PASS

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: No errors

- [ ] **Step 3: Manual golden-path test**

With both backend and frontend running:

1. Login as a user
2. Navigate to a recipe → click collection icon → modal opens
3. Create a new collection "Test" → recipe added → toast confirms
4. Navigate to `/collections` → "Test" collection appears
5. Click collection → recipe visible
6. Click "Rendre publique" → badge "Publique" appears
7. Click "Partager" → URL copied to clipboard
8. Open URL in incognito → collection visible without login
9. In owner view: hover recipe → × button appears → click → recipe removed
10. Navigate to another recipe → add to existing "Test" collection → toast confirms, recipe marked as "Déjà dans cette collection" in modal on next open

- [ ] **Step 4: Commit final**

```bash
git push
```
