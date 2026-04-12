import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type ShoppingListDocument = HydratedDocument<ShoppingList>

@Schema()
export class ShoppingItem {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ min: 0 })
  quantity?: number

  @Prop()
  unit?: string

  @Prop({ default: false })
  checked: boolean
}

@Schema({ _id: false })
export class ServingsOverride {
  @Prop({ type: Types.ObjectId, required: true })
  recipeId: Types.ObjectId

  @Prop({ required: true, min: 1 })
  servings: number
}

@Schema({ timestamps: true })
export class ShoppingList {
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  userId: Types.ObjectId

  @Prop({ required: true, maxlength: 100 })
  name: string

  @Prop({ type: [ShoppingItem], default: [] })
  items: ShoppingItem[]

  @Prop({ type: [{ type: Types.ObjectId, ref: "Recipe" }], default: [] })
  recipeIds: Types.ObjectId[]

  @Prop({ type: [ServingsOverride], default: [] })
  servingsOverrides: ServingsOverride[]

  createdAt: Date
  updatedAt: Date
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList)
