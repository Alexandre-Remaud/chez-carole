import { IsBoolean } from "class-validator"

export class ToggleItemDto {
  @IsBoolean()
  checked: boolean
}
