# Chez Carole

Application web de partage de recettes de cuisine.

## Stack technique

- **Frontend** : React 19, TypeScript, Vite, TanStack Router, Tailwind CSS 4
- **Backend** : NestJS, Mongoose, MongoDB
- **Auth** : JWT (cookies httpOnly), refresh token rotation
- **Tests** : Vitest + Testing Library (frontend), Jest (backend)
- **Monorepo** : pnpm workspaces

## Prérequis

- Node.js >= 20
- pnpm >= 9
- MongoDB (local ou distant)

## Installation

```bash
pnpm install
```

## Configuration

Copier le fichier d'exemple et adapter les valeurs :

```bash
cp backend/.env.example backend/.env
```

Variables d'environnement backend :

| Variable | Description | Exemple |
|---|---|---|
| `MONGO_URI` | URI MongoDB | `mongodb://localhost:27017/chezcarole_dev` |
| `PORT` | Port du serveur | `5000` |
| `JWT_SECRET` | Clé secrète JWT (min 32 chars) | `your-super-secret-key-at-least-32-characters-long` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:5173` |

Le frontend utilise `VITE_API_URL` (défaut : `http://localhost:5000`).

## Lancer le projet

```bash
# Backend (port 5000)
cd backend && pnpm start:dev

# Frontend (port 5173)
cd frontend && pnpm dev
```

## Tests

```bash
# Tous les tests
pnpm test

# Backend uniquement
cd backend && pnpm test

# Frontend uniquement
cd frontend && pnpm test
```

## Lint

```bash
pnpm lint
```
