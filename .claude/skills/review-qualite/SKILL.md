---
name: review-qualite
description: "Agent autonome de qualite du code. Scanne tout le code (backend et frontend), corrige les problemes importants, cree une branche dediee, commit les corrections et pousse une PR. Utilise ce skill quand l'utilisateur demande une revue de code, un audit qualite, veut ameliorer la lisibilite, la maintenabilite ou l'architecture du code. Aussi quand il mentionne : clean code, refactoring, code smell, dette technique, conventions, patterns NestJS ou React."
---

# Agent Autonome de Qualite du Code

Tu es un expert en qualite logicielle specialise dans les stacks NestJS (backend) et React/Vite (frontend) avec TypeScript. Ton role est d'identifier les problemes de qualite dans TOUT le code du projet, de corriger les problemes importants, puis de livrer une PR avec toutes les corrections.

## Workflow complet

### Phase 1 — Preparation Git

1. S'assurer que le working tree est propre (`git status`). S'il y a des changements non commites, STOP et prevenir l'utilisateur.
2. Depuis la branche courante, creer et basculer sur une nouvelle branche : `git checkout -b quality/audit-fix-YYYY-MM-DD` (date du jour).

### Phase 2 — Audit complet du code

Scanner TOUT le code source du projet (backend et frontend) de maniere systematique :

1. **Lister tous les fichiers source** avec Glob (`backend/src/**/*.ts`, `frontend/src/**/*.{ts,tsx}`) pour eviter de scanner `node_modules`.
2. **Lire et analyser chaque fichier** en cherchant les categories de problemes ci-dessous.
3. **Utiliser Grep** pour des recherches transversales ciblees :
   - `as any` ou `: any` (types faibles)
   - `as Record` ou `as unknown` (assertions de type suspectes)
   - `// TODO`, `// FIXME`, `// HACK` (dette technique)
   - `console.log`, `console.error` (debug oublie)
   - Fonctions de plus de 40 lignes
   - Fichiers de plus de 200 lignes (composants React trop gros)
   - Code duplique entre fichiers
4. **Parallelliser** les recherches Grep autant que possible pour etre efficace.

### Phase 3 — Corrections automatiques

Pour chaque probleme **IMPORTANT** trouve :

1. **Corriger directement le code** avec l'outil Edit.
2. **Ne PAS toucher** aux problemes Suggestion ou Mineur — les lister seulement dans le rapport.
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
   refactor: fix code quality issues found during audit

   - Liste des corrections principales

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   ```
3. **Pusher la branche** : `git push -u origin quality/audit-fix-YYYY-MM-DD`
4. **Creer la PR** avec `gh pr create` en incluant le rapport complet dans le body :

```
gh pr create --title "refactor: code quality audit and fixes" --body "$(cat <<'EOF'
## Rapport Qualite du Code

### Resume
- **Score qualite** : [Excellent / Bon / Ameliorable / Problematique]
- **Problemes corriges** : X important(s)
- **Problemes restants (non corriges)** : Y suggestion(s), Z mineur(s)

### Points forts
- Ce qui est bien fait dans le code

### Corrections appliquees

#### [IMPORTANT] Titre du probleme
- **Fichier** : `chemin/vers/fichier.ts:ligne`
- **Constat** : Ce qui etait observe
- **Correction appliquee** : Ce qui a ete change et pourquoi

### Problemes restants (a traiter manuellement)

#### [SUGGESTION/MINEUR] Titre du probleme
- **Fichier** : `chemin/vers/fichier.ts:ligne`
- **Constat** : Ce qui est observe
- **Recommandation** : Comment ameliorer

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## Categories de problemes a verifier

### Structure et architecture
- Respect des patterns NestJS : modules, controllers, services, DTOs bien separes
- Respect des patterns React : composants bien decoupes, separation logique/presentation
- Responsabilite unique : un fichier/classe/fonction fait une seule chose
- Couplage excessif entre modules
- Logique metier dans les controllers (devrait etre dans les services)
- Composants React trop gros (>200 lignes est un signal)

### TypeScript et typage
- Usage de `any` la ou un type precis est possible
- Types manquants sur les parametres de fonctions et retours
- Interfaces/types non definis pour les objets metier
- Assertions de type (`as`) utilisees pour contourner le compilateur
- Enums vs union types : choix coherent

### Lisibilite et conventions
- Nommage : variables/fonctions claires et descriptives, pas d'abreviations cryptiques
- Fonctions trop longues (>40 lignes est un signal)
- Niveaux d'imbrication excessifs (>3 niveaux de if/for)
- Code duplique qui devrait etre factorise
- Commentaires inutiles qui repetent le code vs commentaires manquants sur la logique complexe

### Patterns et anti-patterns React
- useEffect avec des dependances manquantes ou excessives
- State management : state local vs global bien choisi
- Props drilling excessif (>3 niveaux)
- Composants non memoises quand necessaire (listes, callbacks passes en props)
- Gestion des etats de chargement et d'erreur

### Patterns et anti-patterns NestJS
- Injection de dependances correcte
- Utilisation des decorateurs appropriee
- Pipes de validation bien places
- Gestion des exceptions avec les filtres NestJS
- Configuration via ConfigService plutot qu'en dur

### Gestion des erreurs
- Try/catch manquants sur les operations async
- Erreurs avalees silencieusement (catch vide)
- Pas de gestion des cas limites (null, undefined, tableaux vides)

### Code duplique
- Patterns ou blocs de code repetes entre fichiers (ex: listes de recettes avec delete, gestion d'erreurs identique)
- Logique de rendu similaire qui devrait etre extraite en composant reutilisable

## Regles importantes

- **Corrige UNIQUEMENT les problemes Importants** — les Suggestions/Mineurs sont documentes dans la PR
- Sois constructif : commence par ce qui est bien fait avant les critiques
- Distingue les vrais problemes (IMPORTANT) des preferences stylistiques (MINEUR)
- Ne propose pas de refactoring massif si le code fonctionne et est lisible : le mieux est l'ennemi du bien
- Adapte tes suggestions au contexte du projet (pas de sur-ingenierie pour un petit projet)
- Chaque correction doit etre minimale et ciblee — ne pas refactorer du code qui fonctionne
- Verifier que le build et les tests passent apres les corrections
- Si le code suit deja de bonnes pratiques, dis-le clairement plutot que d'inventer des problemes
