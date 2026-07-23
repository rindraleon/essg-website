# Guide de Test - Fonctionnalités d'Admission

Ce guide explique comment tester les fonctionnalités d'admission complètes (frontend, backend, back-office).

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │─────▶│   Backend   │◀─────│   Back-office│
│  (Candidat) │      │   (NestJS)  │      │  (Admin)     │
└─────────────┘      └─────────────┘      └──────────────┘
```

## 1. Configuration Backend

### Fichier `.env` dans `backend-essg/`

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=essg_db
APP_PORT=3000

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### Installation et démarrage

```bash
cd backend-essg
npm install

# Générer la migration et exécuter
npm run migration:run

# Démarrer le serveur
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`

## 2. Configuration Frontend

### Fichier `.env` dans `frontend/`

```env
VITE_PORT=5173
VITE_API_BASE_URL=http://localhost:3000
```

### Installation et démarrage

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 3. Configuration Back-office

### Fichier `.env` dans `back-office/`

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Installation et démarrage

```bash
cd back-office
npm install
npm run dev
```

Le back-office sera accessible sur `http://localhost:5174` (ou autre port configuré)

## 4. Test du Flux Complet

### Étape 1: Candidature (Frontend)

1. Accéder à `http://localhost:5173/admission`
2. Remplir le formulaire de candidature:
   - Nom et Prénom
   - Email et Téléphone
   - Date de naissance
   - Niveau (Licence/Master/Doctorat)
   - Formation souhaitée
   - Dernier diplôme obtenu
   - Accepter les conditions générales
3. Cliquer sur "Soumettre ma candidature"
4. Vérifier le message de succès

### Étape 2: Vérification (Backend)

Les données sont automatiquement enregistrées dans la base de données avec le statut `en_attente`.

### Étape 3: Gestion (Back-office)

1. Se connecter au back-office `http://localhost:5174`
2. Aller dans la page "Admissions"
3. Voir la liste des candidatures
4. Cliquer sur l'icône "Voir détails" pour consulter une candidature
5. Cliquer sur "Modifier le statut" pour:
   - Changer le statut (En attente → En cours d'étude → Accepté/Refusé)
   - Ajouter un commentaire
6. Cliquer sur "Enregistrer"

## 5. API Endpoints

### POST `/admissions`
Crée une nouvelle candidature

**Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "telephone": "+261 34 12 345 67",
  "dateNaissance": "2000-05-15",
  "niveau": "licence",
  "formation": "geomatique-applications",
  "diplomePrecedent": "Baccalauréat scientifique",
  "accepteConditions": true
}
```

### GET `/admissions`
Récupère toutes les candidatures

### GET `/admissions/:id`
Récupère une candidature par ID

### PATCH `/admissions/:id/status`
Met à jour le statut d'une candidature

**Body:**
```json
{
  "statut": "accepte",
  "commentaire": "Candidature retenue"
}
```

### DELETE `/admissions/:id`
Supprime une candidature

## 6. Structure de la Base de Données

### Table `admissions`

| Colonne | Type | Description |
|---------|------|-------------|
| id | serial | Identifiant unique |
| nom | varchar(255) | Nom du candidat |
| prenom | varchar(255) | Prénom du candidat |
| email | varchar(255) | Email du candidat |
| telephone | varchar(50) | Numéro de téléphone |
| dateNaissance | date | Date de naissance |
| niveau | varchar(50) | Niveau d'études |
| formation | varchar(255) | Formation souhaitée |
| diplomePrecedent | varchar(255) | Dernier diplôme |
| cvPath | varchar(255) | Chemin du CV (optionnel) |
| lettreMotivationPath | varchar(255) | Chemin de la lettre (optionnel) |
| statut | enum | Statut de la candidature |
| commentaire | text | Commentaire de l'admin |
| creeLe | timestamptz | Date de création |
| misAJourLe | timestamptz | Date de mise à jour |

### Statuts possibles

- `en_attente` - Candidature soumise, en attente de traitement
- `en_cours_etude` - Candidature en cours d'examen
- `accepte` - Candidature acceptée
- `refuse` - Candidature refusée

## 7. Vérification de l'Intégration

### Checklist de test

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Back-office démarre sans erreur
- [ ] Formulaire de candidature s'affiche correctement
- [ ] Soumission d'une candidature fonctionne
- [ ] La candidature apparaît dans le back-office
- [ ] Le statut peut être modifié
- [ ] Les commentaires peuvent être ajoutés
- [ ] La recherche fonctionne
- [ ] Les filtres par statut fonctionnent
- [ ] Les statistiques se mettent à jour

## 8. Dépannage

### Erreur CORS
Vérifier que l'origine du frontend/back-office est autorisée dans `backend-essg/src/main.ts`

### Erreur de connexion à la base de données
Vérifier les paramètres PostgreSQL dans le fichier `.env` du backend

### Erreur 404 sur `/admissions`
Vérifier que le module `AdmissionsModule` est bien enregistré dans `app.module.ts`

### Fichiers uploadés non accessibles
Vérifier que le dossier `uploads/` existe et contient un fichier `.gitkeep`

## 9. Prochaines Étapes (Améliorations possibles)

- [ ] Upload et gestion des fichiers CV et lettre de motivation
- [ ] Envoi d'email de confirmation au candidat
- [ ] Notification par email lors du changement de statut
- [ ] Export des candidatures en PDF/Excel
- [ ] Système de notation des candidatures
- [ ] Historique des modifications
- [ ] Filtres avancés et recherche full-text