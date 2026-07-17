# Fonctionnalité d'Upload de Logo Partenaire

## Vue d'ensemble

Cette fonctionnalité permet d'ajouter des images de logo pour les partenaires, en plus des emojis déjà existants.

## Architecture

### Backend (NestJS)

#### 1. Configuration Multer
- **Fichier**: `backend-essg/src/parteners/config/multer.config.ts`
- Configure le stockage des images dans `backend-essg/uploads/logos/`
- Filtre les types de fichiers acceptés: JPG, PNG, GIF, WebP
- Limite la taille des fichiers à 5MB
- Génère des noms de fichiers uniques avec timestamp

#### 2. Contrôleur
- **Fichier**: `backend-essg/src/parteners/partners.controller.ts`
- Utilise `FileInterceptor` de NestJS pour gérer l'upload
- Les endpoints `create` et `update` acceptent maintenant des fichiers
- Le chemin du logo est sauvegardé dans la base de données

#### 3. Entité
- **Fichier**: `backend-essg/src/parteners/entities/partner.entity.ts`
- Champ `logo` déjà existant (type string)
- Stocke le chemin relatif du fichier uploadé

#### 4. Serveur de fichiers statiques
- **Fichier**: `backend-essg/src/main.ts`
- Configure Express pour servir les fichiers depuis le dossier `uploads/`
- Les fichiers sont accessibles via `/uploads/logos/[filename]`

### Frontend (React + TypeScript)

#### 1. Formulaire PartenaireForm
- **Fichier**: `back-office/src/components/PartenaireComponents/PartenaireForm.tsx`
- Ajout d'un input file caché avec preview
- Affichage d'un Avatar avec aperçu du logo
- Validation du type de fichier (côté client)
- Validation de la taille (5MB max)
- Envoi en FormData quand un fichier est présent

#### 2. Service Frontend
- **Fichier**: `back-office/src/services/partenaires.service.ts`
- Détecte si les données sont un FormData
- Ajoute le header `Content-Type: multipart/form-data` si nécessaire

#### 3. Affichage dans la Table
- **Fichier**: `back-office/src/components/PartenaireComponents/PartenaireTable.tsx`
- Détecte si le logo est une image ou un emoji
- Affiche l'image si c'est un chemin `/uploads/` ou `http`
- Affiche l'emoji sinon

#### 4. Dialogue de Visualisation
- **Fichier**: `back-office/src/components/PartenaireComponents/PartenaireViewDialog.tsx`
- Affiche le logo en taille réelle dans le dialogue
- Montre le chemin du fichier si c'est une image

## Utilisation

### Côté Backend

1. **Démarrer le serveur**:
   ```bash
   cd backend-essg
   npm run start:dev
   ```

2. **Vérifier le dossier uploads**:
   - Le dossier `backend-essg/uploads/logos/` est créé automatiquement
   - Les images uploadées sont stockées ici

### Côté Frontend

1. **Démarrer le frontend**:
   ```bash
   cd back-office
   npm run dev
   ```

2. **Utiliser la fonctionnalité**:
   - Aller dans la page "Partenaires"
   - Cliquer sur "Nouveau partenaire" ou "Modifier" un partenaire existant
   - Dans le formulaire, section "Logo":
     - Cliquer sur "Ajouter un logo" pour uploader une image
     - Ou utiliser un emoji dans le champ prévu à cet effet
   - Remplir les autres champs et soumettre le formulaire

## Formats acceptés

- JPG / JPEG
- PNG
- GIF
- WebP

## Limites

- Taille maximale: 5MB par fichier
- Les fichiers sont renommés avec un timestamp unique pour éviter les conflits

## Structure des dossiers

```
backend-essg/
├── uploads/
│   ├── .gitkeep
│   └── logos/
│       ├── .gitkeep
│       ├── logo-123456789-123456789.jpg
│       ├── logo-123456790-987654321.png
│       └── ...
```

## Sécurité

- Validation du type MIME côté serveur (Multer fileFilter)
- Validation de la taille côté serveur (Multer limits)
- Validation du type de fichier côté client
- Validation de la taille côté client
- CORS configuré pour les origines autorisées

## Notes

- Les emojis restent fonctionnels pour les partenaires sans image
- Un partenaire peut avoir soit un emoji, soit une image, soit les deux (l'image a priorité d'affichage)
- Les images sont servies statiquement par Express
- Le chemin relatif est stocké en base de données (ex: `/uploads/logos/logo-123.jpg`)