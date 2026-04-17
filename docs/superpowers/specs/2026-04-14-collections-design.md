# Design — Collections / Carnets

Date: 2026-04-14

## Contexte

Les utilisateurs peuvent organiser leurs recettes en collections thématiques (ex: "Noël", "BBQ"). Collections privées par défaut, partageables par URL si publiques.

## Décisions clés

| Sujet | Décision | Raison |
|-------|----------|--------|
| Ordre recettes | Chronologique (ajout) | Drag & drop reporté en v2 |
| Page discovery | Pas en v1 (`/collections` = mes collections) | Scope trop large pour v1 |
| Cover image | Upload via `POST /upload` existant, fallback = première recette avec image | Cohérent avec avatar profil |
| Modal "ajouter à collection" | Nouveau `AddToCollectionModal`, pattern AddToListModal sans section portions | Logiques trop différentes pour composant générique |
| URL partageable | `GET /collections/:id` public si `isPublic` | Partage par lien suffit en v1 |

## Backend

### Module `collections/`

Nouveau module NestJS suivant le pattern `favorites/` (controller / service / entity / dto).

### Entité Collection

| Champ       | Type       | Contraintes                    |
|-------------|------------|-------------------------------|
| _id         | ObjectId   | PK, auto                      |
| userId      | ObjectId   | ref: User, required           |
| name        | string     | required, max 100             |
| description | string     | optional, max 500             |
| isPublic    | boolean    | default: false                |
| recipeIds   | ObjectId[] | ref: Recipe, ordre chronologique |
| coverImage  | string     | optional, URL après upload    |
| createdAt   | Date       | auto                          |
| updatedAt   | Date       | auto                          |

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /collections | protégé | Créer une collection |
| GET | /collections/me | protégé | Mes collections (paginé) |
| GET | /collections/:id | public si isPublic, sinon owner | Détail + recettes populées |
| PATCH | /collections/:id | owner | Modifier (name, description, isPublic, coverImage) |
| DELETE | /collections/:id | owner | Supprimer |
| POST | /collections/:id/recipes | owner | Ajouter recette (409 si déjà présente) |
| DELETE | /collections/:id/recipes/:recipeId | owner | Retirer recette |

### Règles métier

- Nombre illimité de collections par utilisateur.
- Une recette peut appartenir à plusieurs collections.
- Suppression collection ne supprime pas les recettes.
- `GET /collections/:id` : 200 si `isPublic`, 403 si privée + non owner, 404 si inexistante.
- Cover image : URL stockée après appel séparé à `POST /upload`. Fallback géré côté frontend.

## Frontend

### Routes

- `/collections` — mes collections (grille, bouton "Nouvelle collection"). Auth requise.
- `/collections/$collectionId` — détail. Public si `isPublic`, sinon owner uniquement.

### Feature folder `src/features/collections/`

```
api.ts          — appels HTTP
hooks.ts        — TanStack Query (useMyCollections, useCollection, useMutateCollection)
schema.ts       — Zod (createCollectionSchema, editCollectionSchema)
types.ts        — types Collection, CollectionDetail
components/
  CollectionCard.tsx         — carte grille (nom, cover, nb recettes, badge public/privé)
  CollectionForm.tsx         — formulaire create/edit (nom, description, isPublic, upload cover)
  AddToCollectionModal.tsx   — modal ajout recette à collection (vue select / vue create)
```

### AddToCollectionModal

Même UX que `AddToListModal` :
- Vue "select" : liste des collections de l'utilisateur. Item grisé si recette déjà présente.
- Vue "create" : champ nom + description optionnelle, puis ajoute directement la recette.
- Bouton "Ajouter à une collection" sur fiche recette, à côté de favoris/panier.

### Page `/collections`

- Grille de `CollectionCard`.
- Bouton "Nouvelle collection" → ouvre `CollectionForm` en modal ou navigation.
- Message vide : "Créez votre première collection depuis une fiche recette."

### Page `/collections/$collectionId`

- Nom, description, badge public/privé.
- Cover image (uploadable par owner).
- Grille de recettes (ordre chronologique).
- Owner : bouton retirer recette, bouton modifier collection.
- Si `isPublic` : bouton "Partager" → copie URL presse-papiers + meta OG (titre = nom, image = coverImage ou première recette).

### Meta OG

- `og:title` = nom de la collection
- `og:image` = coverImage || première image recette || image par défaut app
- Uniquement sur collections publiques

## Critères d'acceptance

- [ ] Créer, modifier, supprimer une collection.
- [ ] Ajouter / retirer une recette via `AddToCollectionModal` depuis fiche recette.
- [ ] Collections listées dans `/collections` (mes collections uniquement).
- [ ] Collection publique accessible par URL sans auth.
- [ ] Collection privée retourne 403 pour non-owner.
- [ ] Upload cover image via endpoint `/upload` existant.
- [ ] Fallback cover = première recette avec image.
- [ ] Bouton partager copie URL (collections publiques).
- [ ] Meta OG sur collections publiques.

## Dépendances

- `auth.md` : authentification owner
- `recipes.md` : recettes dans les collections
- `upload/` module existant : cover image
