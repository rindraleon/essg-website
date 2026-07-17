# Guide de test - Upload d'avatar utilisateur

## Prérequis

1. **Base de données** : Exécuter la migration pour ajouter la colonne avatar
   ```bash
   cd backend-essg
   npm run migration:run
   ```

2. **Répertoires d'upload** : Les répertoires ont été créés automatiquement
   - `backend-essg/uploads/avatars/`

3. **Dépendances** : Déjà installées
   - uuid
   - @types/uuid

## Démarrage de l'application

### Backend
```bash
cd backend-essg
npm run start:dev
```
Le backend démarre sur `http://localhost:3000`

### Frontend
```bash
cd back-office
npm run dev
```
Le frontend démarre sur `http://localhost:5173` (ou autre port configuré)

## Test de l'upload d'avatar

### 1. Créer un nouvel utilisateur avec avatar
1. Aller dans la page "Utilisateurs"
2. Cliquer sur "+ Nouvel utilisateur"
3. Remplir le formulaire
4. Cliquer sur "Ajouter une photo"
5. Sélectionner une image (JPG, PNG, GIF, WebP - max 5MB)
6. Vérifier la prévisualisation
7. Cliquer sur "Créer"

**Résultat attendu** : L'utilisateur est créé avec l'avatar

### 2. Modifier l'avatar d'un utilisateur existant
1. Dans la liste des utilisateurs, cliquer sur le bouton d'édition (crayon)
2. Cliquer sur "Changer la photo"
3. Sélectionner une nouvelle image
4. Cliquer sur "Enregistrer"

**Résultat attendu** : L'avatar est mis à jour

### 3. Supprimer l'avatar
1. Ouvrir le formulaire d'édition
2. Cliquer sur le bouton de suppression (X) sur l'avatar
3. Cliquer sur "Enregistrer"

**Résultat attendu** : L'avatar est supprimé, les initiales s'affichent

### 4. Voir les détails d'un utilisateur
1. Cliquer sur le bouton "Voir" (œil) dans la liste
2. Vérifier que l'avatar s'affiche en grand (120x120px)
3. Vérifier que les informations sont bien présentées

## Validation des améliorations

### Formulaire (UsersForm.tsx)
- ✅ Upload d'image avec prévisualisation
- ✅ Validation du format (JPG, PNG, GIF, WebP)
- ✅ Validation de la taille (max 5MB)
- ✅ Affichage des initiales si pas d'avatar
- ✅ Bouton de suppression d'avatar
- ✅ Indicateur de chargement pendant l'upload
- ✅ Helper text pour l'email en mode édition

### Page de détail (UsersViewDialog.tsx)
- ✅ Avatar en grand (120x120px)
- ✅ Nom complet sous l'avatar
- ✅ Cartes grises pour chaque information
- ✅ Grille responsive (2 colonnes desktop, 1 mobile)
- ✅ Séparateurs visuels (Divider)
- ✅ Initiales si pas d'avatar

## Dépannage

### Erreur 404 sur l'upload
- Vérifier que le backend est démarré
- Vérifier que les répertoires `uploads/avatars` existent
- Vérifier les logs du backend pour les erreurs

### Erreur de migration
```bash
cd backend-essg
npm run migration:revert  # Annuler la dernière migration
npm run migration:run    # Ré-exécuter
```

### Erreur CORS
- Vérifier que l'URL du frontend est dans la liste CORS du backend (main.ts ligne 22-28)

## Structure des fichiers modifiés

### Backend
- `backend-essg/src/users/entities/user.entity.ts` - Ajout colonne avatar
- `backend-essg/src/users/dto/create-user.dto.ts` - Ajout champ avatar
- `backend-essg/src/users/users.controller.ts` - Endpoint upload avatar
- `backend-essg/src/users/users.service.ts` - Méthode updateAvatar
- `backend-essg/src/upload/upload.service.ts` - Service upload (nouveau)
- `backend-essg/src/users/migrations/1731598320000-AddAvatarToUsers.ts` - Migration

### Frontend
- `back-office/src/types/auth.types.ts` - Types avec avatar
- `back-office/src/services/users.service.ts` - Fonction uploadAvatar
- `back-office/src/components/UsersComponent/UsersForm.tsx` - Upload dans formulaire
- `back-office/src/components/UsersComponent/UsersViewDialog.tsx` - Vue détaillée améliorée