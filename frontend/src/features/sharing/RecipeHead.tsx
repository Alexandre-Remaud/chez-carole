import { Helmet } from "react-helmet-async"
import type { Recipe } from "@recipes/contract"

interface RecipeHeadProps {
  recipe: Recipe
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, max - 3) + "..."
}

export default function RecipeHead({ recipe }: RecipeHeadProps) {
  const title = recipe.title
  const description = truncate(recipe.description || "", 160)
  const image = recipe.imageMediumUrl || recipe.imageUrl || undefined
  const url = `${window.location.origin}/recipes/${recipe._id}`

  return (
    <Helmet>
      <title>{title} — Chez Carole</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Chez Carole" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
