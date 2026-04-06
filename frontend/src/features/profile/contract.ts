export interface PublicProfile {
  id: string
  name: string
  avatarUrl?: string
  bio?: string
  createdAt: string
  recipesCount: number
}

export interface UpdateProfileData {
  name?: string
  bio?: string
  avatarUrl?: string
}

export interface ChangeEmailData {
  newEmail: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface UserRecipesResponse {
  data: Array<{
    _id: string
    title: string
    description: string
    imageUrl?: string
    imageThumbnailUrl?: string
    imageMediumUrl?: string
    category?: string
    prepTime?: number
    cookTime?: number
    servings?: number
    difficulty?: string
    createdAt: string
  }>
  total: number
}
