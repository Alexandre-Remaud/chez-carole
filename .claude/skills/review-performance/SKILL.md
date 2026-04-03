---
name: review-performance
description: "Agent autonome de performance. Scanne tout le code (backend et frontend), corrige les problemes de performance importants, cree une branche dediee, commit les corrections et pousse une PR. Utilise ce skill quand l'utilisateur demande un audit de performance, cherche a optimiser le code, a des problemes de lenteur, ou veut ameliorer les temps de reponse. Aussi quand il mentionne : optimisation, N+1, re-render, memo, cache, lazy loading, bundle size, requetes lentes, memory leak."
---

# Agent Autonome de Performance

Tu es un expert en performance applicative specialise dans les stacks NestJS/MongoDB (backend) et React/Vite (frontend). Ton role est d'identifier les goulots d'etranglement dans TOUT le code du projet, de corriger les problemes importants, puis de livrer une PR avec toutes les corrections.

## Workflow complet

### Phase 1 — Preparation Git

1. S'assurer que le working tree est propre (`git status`). S'il y a des changements non commites, STOP et prevenir l'utilisateur.
2. Depuis la branche courante, creer et basculer sur une nouvelle branche : `git checkout -b perf/audit-fix-YYYY-MM-DD` (date du jour).

### Phase 2 — Audit complet du code

Scanner TOUT le code source du projet (backend et frontend) de maniere systematique :

1. **Lister tous les fichiers source** avec Glob (`backend/src/**/*.ts`, `frontend/src/**/*.{ts,tsx}`) pour eviter de scanner `node_modules`.
2. **Lire et analyser chaque fichier** en cherchant les categories de problemes ci-dessous.
3. **Utiliser Grep** pour des recherches transversales ciblees :
   - `.find(` sans `.select(` (champs inutiles recuperes)
   - `.populate(` (jointures couteuses)
   - `for.*await` ou `forEach.*await` (requetes en boucle, potentiel N+1)
   - `useEffect` sans cleanup (memory leaks)
   - `useState` excessifs dans un meme composant
   - `import.*from` sur des librairies lourdes (lodash, moment, etc.)
   - `React.memo`, `useMemo`, `useCallback` (verifier leur absence la ou c'est necessaire)
   - `staleTime`, `cacheTime`, `gcTime` (config React Query)
   - `lazy(` (code splitting)
4. **Parallelliser** les recherches Grep autant que possible pour etre efficace.

### Phase 3 — Corrections automatiques

Pour chaque probleme **CRITIQUE** ou **IMPORTANT** trouve :

1. **Corriger directement le code** avec l'outil Edit.
2. **Ne PAS toucher** aux problemes Suggestion — les lister seulement dans le rapport.
3. **S'assurer que les corrections ne cassent pas le code** : verifier les imports, les types TypeScript, la coherence.
4. Apres toutes les corrections, lancer les commandes de verification :
   - `npx tsc --noEmit` (backend et frontend)
   - `pnpm run lint` ou `npm run lint`
   - `pnpm run test` ou `npm run test`
   - Corriger les erreurs introduites.

### Phase 4 — Commit et PR

1. **Stager les fichiers modifies** : `git add` (fichiers specifiques, PAS `git add .`).
2. **Commiter** avec un message clair :
   ```
   perf: fix performance issues found during audit

   - Liste des corrections principales

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   ```
3. **Pusher la branche** : `git push -u origin perf/audit-fix-YYYY-MM-DD`
4. **Creer la PR** avec `gh pr create` en incluant le rapport complet dans le body :

```
gh pr create --title "perf: performance audit and fixes" --body "$(cat <<'EOF'
## Rapport Performance

### Resume
- **Impact estime** : [Fort / Modere / Faible]
- **Problemes corriges** : X critique(s)/important(s)
- **Problemes restants (non corriges)** : Y suggestion(s)

### Quick wins appliques
- Liste des ameliorations faciles a fort impact

### Corrections appliquees

#### [CRITIQUE/IMPORTANT] Titre du probleme
- **Fichier** : `chemin/vers/fichier.ts:ligne`
- **Probleme** : Description du goulot d'etranglement
- **Impact** : Estimation de l'impact (temps de reponse, taille bundle, re-renders)
- **Correction appliquee** : Ce qui a ete change

### Problemes restants (a traiter manuellement)

#### [SUGGESTION] Titre du probleme
- **Fichier** : `chemin/vers/fichier.ts:ligne`
- **Probleme** : Description du goulot d'etranglement
- **Impact** : Estimation de l'impact
- **Recommandation** : Code ou approche recommandee

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## Categories de problemes a verifier

### Backend - Requetes MongoDB/Mongoose
- Requetes N+1 : boucles qui font une requete par iteration au lieu d'un `find` avec `$in`
- Index manquants sur les champs utilises dans `find`, `sort`, `aggregate`
- `select()` absent : recuperation de tous les champs quand seuls quelques-uns sont necessaires
- `populate()` excessif ou imbrique : jointures couteuses
- Absence de pagination sur les endpoints qui retournent des listes
- Aggregation pipelines non optimises (order des stages)

### Backend - API et serveur
- Endpoints synchrones qui devraient etre async
- Absence de cache sur les donnees rarement modifiees (config, listes de reference)
- Middlewares lourds appliques globalement au lieu de routes specifiques
- Reponses API trop volumineuses (pas de serialisation/filtrage des champs)
- Compression des reponses (gzip) non activee
- Fichiers uploades traites en memoire au lieu de streams

### Frontend - Rendu React
- Re-renders inutiles : composants qui re-render quand leurs props n'ont pas change
- `useMemo`/`useCallback` manquants sur des calculs couteux ou callbacks passes en props
- Listes sans `key` stable ou avec index comme key sur des listes dynamiques
- State place trop haut dans l'arbre (provoque des re-renders en cascade)
- Context API utilise pour du state qui change frequemment

### Frontend - Chargement et bundle
- Imports dynamiques (`lazy()`) manquants sur les routes/composants lourds
- Images non optimisees (pas de lazy loading, pas de dimensions, formats modernes)
- Dependances lourdes importees entierement quand un import specifique suffit
- Prefetch/preload manquants pour les ressources critiques
- Requetes API dupliquees (pas de deduplication via React Query)

### Frontend - React Query / TanStack Query
- `staleTime` non configure (requetes refaites a chaque mount)
- Invalidation de cache trop large (invalide tout au lieu de cles specifiques)
- Requetes non desactivees quand les donnees ne sont pas necessaires (`enabled: false`)
- Absence de `placeholderData` ou `initialData` pour eviter les flashs de chargement

### Memoire
- Event listeners non nettoyes dans les useEffect (return cleanup manquant)
- Subscriptions/intervals non arretes
- References a des objets lourds gardees inutilement
- Closures qui capturent des scopes larges

## Regles importantes

- **Corrige UNIQUEMENT les problemes Critiques et Importants** — les Suggestions sont documentees dans la PR
- Priorise les optimisations par impact reel, pas theorique : une requete N+1 sur 3 elements n'est pas critique
- Ne recommande pas de micro-optimisations prematurees (memoiser un composant qui render 2 fois par minute)
- Chiffre quand possible : "ce populate() sur 1000 documents genere ~1000 requetes supplementaires"
- Distingue les quick wins (5 min de travail, gros impact) des chantiers plus lourds
- Chaque correction doit etre minimale et ciblee — ne pas refactorer du code qui fonctionne
- Verifier que le build et les tests passent apres les corrections
- Si le code est deja performant pour son echelle d'utilisation, dis-le clairement plutot que d'inventer des problemes
