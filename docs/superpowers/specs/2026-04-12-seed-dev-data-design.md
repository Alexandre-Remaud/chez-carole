# Design : Script de seed de données de développement

**Date :** 2026-04-12  
**Statut :** Approuvé

---

## Objectif

Créer un script de seed standalone (`ts-node`) qui peuple la base MongoDB de développement avec des données réalistes et variées pour permettre de tester toutes les fonctionnalités de l'application.

---

## Comportement

- **Reset complet** à chaque exécution : vide les collections concernées puis recrée toutes les données
- Collections vidées : `users`, `recipes`, `reviews`, `favorites`, `shoppinglists`
- Commande : `pnpm seed` depuis `backend/`

---

## Architecture

### Fichier unique

`backend/src/seed.ts` — script standalone qui :
1. Se connecte à MongoDB via Mongoose (lit `MONGO_URI` + `MONGO_DB_NAME` depuis `.env`)
2. Vide les collections dans l'ordre (reviews, favorites, shoppinglists, recipes, users)
3. Insère les données dans l'ordre inverse (users, recipes, reviews, favorites, shoppinglists)
4. Recalcule `averageRating` et `ratingsCount` sur chaque recette après insertion des reviews
5. Se déconnecte et quitte

Pas de NestJS bootstrap. Utilise directement les modèles Mongoose et `bcrypt` pour les mots de passe.

---

## Données

### Users (4)

| Nom | Email | Role | Bio |
|-----|-------|------|-----|
| Carole Dupont | carole@admin.fr | ADMIN | Fondatrice et chef passionnée |
| Sophie Martin | sophie@example.fr | USER | Amatrice de cuisine provençale |
| Lucas Bernard | lucas@example.fr | USER | Cuisinier du dimanche |
| Emma Petit | emma@example.fr | USER | Végétarienne convaincue |

Tous les avatarUrl renseignés (URLs publiques de placeholder). Mots de passe hashés avec bcrypt.

### Recipes (≥20)

Réparties entre les 4 users (~5 par user). Tous les champs remplis :
- `title`, `description`, `ingredients`, `steps`
- `prepTime`, `cookTime`, `servings`
- `difficulty` : toutes les valeurs (`easy`, `medium`, `hard`)
- `category` : toutes les valeurs couvertes (`appetizer`, `starter`, `main_course`, `side_dish`, `dessert`, `snack`, `beverage`, `sauce`)
- `imageUrl` / `imageThumbnailUrl` / `imageMediumUrl` : URLs publiques de placeholder

**Unités d'ingrédients couverts :** `g`, `kg`, `ml`, `cl`, `l`, `cs` (cuillère à soupe), `cc` (cuillère à café), `pièce(s)`, `pincée`

**Steps :** chaque recette a au minimum 3 étapes avec `order`, `instruction`, et au moins une step avec `duration` + `durationUnit`, une avec `temperature` + `temperatureUnit`, et une avec `note`.

### Reviews (2-3 par recette)

- Auteur ≠ auteur de la recette
- Ratings variés (1 à 5)
- Commentaires en français
- Après insertion, `averageRating` et `ratingsCount` sont calculés et mis à jour sur chaque recette

### Favorites

- Chaque user a entre 4 et 6 recettes en favoris
- Les recettes favorites appartiennent à d'autres users (pas les siennes)

### ShoppingLists

- 2 listes par user (8 au total)
- Chaque liste a 4-8 items (`name`, `quantity`, `unit`, `checked` varié : certains cochés, d'autres non)
- `recipeIds` renseigné sur au moins une liste par user (lien vers 1-2 recettes)
- `servingsOverrides` renseigné sur ces mêmes listes pour tester le recalcul de portions
- Thèmes différents par user (ex. "Courses de la semaine", "Dîner du dimanche")

---

## Script `package.json`

```json
"seed": "ts-node -r tsconfig-paths/register src/seed.ts"
```

---

## Variables d'environnement requises

Le script lit les mêmes variables que l'app : `MONGO_URI`, `MONGO_DB_NAME` (via `dotenv`).

---

## Hors scope

- Pas de seed pour `refresh_tokens` et `images` (gérés dynamiquement)
- Pas d'idempotence partielle (toujours reset complet)
- Pas de seed pour l'environnement de production
