# Back-office ESSG

Interface d'administration (React + TypeScript + Vite + Tailwind CSS + TanStack Query v5 + Base UI + sonner).
Consomme l'API NestJS `backend-essg` — voir le README racine du projet pour la vue d'ensemble.

## ⚡ Commandes importantes

```bash
npm install        # installer les dépendances
npm run dev        # développement (port 5000 par défaut, HMR)
npm run build      # typecheck (tsc -b) + build production → dist/
npm run preview    # prévisualiser le build
npm run lint       # ESLint avec correction automatique
npm run lint:sonar # ESLint sans correction (qualimétrie)
```

## 🔧 Variables d'environnement

Copier `.env.example` → `.env` :

```bash
VITE_PORT=5000                      # port du dev server
VITE_API_BASE_URL=http://localhost:3000  # URL de l'API NestJS
```

## 🗂 Structure (l'essentiel)

```
src/
├── api/            # client HTTP (enveloppe { statusCode, data, meta }, gestion 401 fins de session)
├── components/     # UsersComponent (table, sessions, badge), ui/ (Base UI), common/ (DataTable, ConfirmDialog…)
├── contexts/       # AuthContext (login one-shot, logout réel, session exposée)
├── hooks/          # queries/ (queryKeys + hooks TanStack), useSessionActivity, useSessionStatusStream
├── pages/          # une page = un dossier dans pages/
└── services/       # appels API par domaine (auth, session, users, formations…)
```

## 🔐 Sessions — comment ça marche (volet 3)

- **Statuts pilotés par le serveur** : 🟢 En ligne (< 10 min) · 🟡 Inactif (10–15 min) · ⚪ Hors ligne · 🔴 Terminée.
- La page **Utilisateurs** porte une colonne « Session » + deux actions admin : voir les sessions d'un utilisateur (multi-appareils, révocation individuelle) et déconnecter (ConfirmDialog).
- **SSE temps réel** : `useSessionStatusStream` (admin) écoute `GET /sessions/stream?access_token=…` et patche le cache TanStack en place — pas de re-fetch.
- **Heartbeat** : `useSessionActivity` envoie `POST /sessions/heartbeat` (throttle ~55 s) **uniquement sur vraie interaction** (clic, saisie, scroll, retour d'onglet). Un onglet inactif n'envoie rien → la session expire à 15 min.
- **Fin de session automatique** : tout 401 authentifié porte un code (`SESSION_EXPIRED`, `SESSION_REVOKED`…) → nettoyage du jeton → redirection `/login?reason=…&redirect=…` avec le **message FR exact**. Un mauvais mot de passe n'est pas traité comme une fin de session.
- **Logout réel** : `POST /auth/logout` invalide la session côté serveur (statut `logged_out`).

> Comptes de dev : `admin@essg.sn / Admin@2026` (admin) · `lecteur@essg.sn / Lecteur@2026` (lecteur).

## ⚠️ Pièges connus

- `node_modules` n'est pas persisté dans ce workspace : relancer `npm install` après une restauration.
- Le token transite en query string **uniquement** pour le flux SSE (limite EventSource) — route admin-only.
- ESLint : `react-refresh/only-export-components` sur `AuthContext.tsx` et des erreurs `UsersViewDialog.tsx` sont **préexistantes** (hors périmètre volet 3).
