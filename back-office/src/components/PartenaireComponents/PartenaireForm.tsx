import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  FormHelperText,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getImageUrl } from '../../utils/image.utils';
import type { Partenaire, PartenaireFormData } from '../../types/partenaire.types';
import { PARTENAIRE_TYPES, DEFAULT_PARTENAIRE_FORM_DATA } from '../../constants/partenaire.constants';

interface PartenaireFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PartenaireFormData) => void;
  initialData?: Partenaire | null;
  mode: 'create' | 'edit';
}

interface FormErrors {
  nom?: string;
  description?: string;
  type?: string;
  secteur?: string;
  dateDebut?: string;
}

const PartenaireForm: React.FC<PartenaireFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<PartenaireFormData>(DEFAULT_PARTENAIRE_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({
          nom: initialData.nom || '',
          type: initialData.type || 'Entreprise',
          secteur: initialData.secteur || '',
          dateDebut: initialData.dateDebut || new Date().toISOString().split('T')[0],
          description: initialData.description || '',
          logo: initialData.logo || '',
          siteWeb: initialData.siteWeb || '',
          contact: initialData.contact || '',
        });
        // Charger l'aperçu du logo existant
        if (initialData.logo) {
          setLogoPreview(getImageUrl(initialData.logo));
        } else {
          setLogoPreview('');
        }
      } else {
        setFormData(DEFAULT_PARTENAIRE_FORM_DATA);
        setLogoPreview('');
      }
      setLogoFile(null);
      setErrors({});
      setTouched({});
    }
  }, [open, mode, initialData]);

  const validate = (data: PartenaireFormData): FormErrors => {
    const newErrors: FormErrors = {};

    const nom = data.nom || '';
    const description = data.description || '';
    const secteur = data.secteur || '';

    if (!nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (nom.trim().length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (description.trim().length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!data.type) {
      newErrors.type = 'Le type est requis';
    }

    if (!secteur.trim()) {
      newErrors.secteur = 'Le secteur est requis';
    }

    if (!data.dateDebut) {
      newErrors.dateDebut = 'La date de début est requise';
    }

    return newErrors;
  };

  const handleChange = (field: keyof PartenaireFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    if (touched[field]) {
      const fieldErrors = validate(newData);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field as keyof FormErrors],
      }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format d\'image non supporté. Utilisez JPG, PNG, GIF ou WebP.');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      setLogoFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field as keyof FormErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    Object.keys(DEFAULT_PARTENAIRE_FORM_DATA).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Si un nouveau logo a été uploadé, créer un FormData
      if (logoFile) {
        const formDataObj = new FormData();
        formDataObj.append('nom', formData.nom);
        formDataObj.append('type', formData.type);
        formDataObj.append('secteur', formData.secteur);
        formDataObj.append('description', formData.description);
        formDataObj.append('dateDebut', formData.dateDebut);
        formDataObj.append('logo', logoFile);
        if (formData.siteWeb) formDataObj.append('siteWeb', formData.siteWeb);
        if (formData.contact) formDataObj.append('contact', formData.contact);

        // Appeler onSubmit avec le FormData
        await onSubmit(formDataObj as any);
      } else {
        // Pas de nouveau logo, envoyer les données normales
        await onSubmit(formData);
      }
      onClose();
    }
  };

  const isFormTitle = mode === 'create' ? 'Nouveau partenaire' : 'Modifier le partenaire';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold">{isFormTitle}</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box className="space-y-5">
            {/* Nom */}
            <div className="w-full">
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nom"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                onBlur={() => handleBlur('nom')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Entrez le nom du partenaire"
              />
              {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>

            {/* Row: Type + Secteur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormControl fullWidth error={Boolean(errors.type)} required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => handleChange('type', e.target.value)}
                  onBlur={() => handleBlur('type')}
                  sx={{ borderRadius: '8px' }}
                >
                  {PARTENAIRE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>

              <div className="w-full">
                <label htmlFor="secteur" className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="secteur"
                  value={formData.secteur}
                  onChange={(e) => handleChange('secteur', e.target.value)}
                  onBlur={() => handleBlur('secteur')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.secteur ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Technologie, Finance, Santé..."
                />
                {errors.secteur && <p className="mt-1 text-sm text-red-500">{errors.secteur}</p>}
              </div>
            </div>

            {/* Date début */}
            <div className="w-full">
              <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateDebut"
                value={formData.dateDebut}
                onChange={(e) => handleChange('dateDebut', e.target.value)}
                onBlur={() => handleBlur('dateDebut')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dateDebut ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateDebut && <p className="mt-1 text-sm text-red-500">{errors.dateDebut}</p>}
            </div>

            {/* Description */}
            <div className="w-full">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Décrivez le partenariat..."
              />
              {(errors.description || formData.description.length > 0) && (
                <p className={`mt-1 text-sm ${errors.description ? 'text-red-500' : 'text-gray-500'}`}>
                  {errors.description || `${formData.description.length} caractère(s)`}
                </p>
              )}
            </div>

            {/* Logo */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              
              {/* Aperçu du logo */}
              <Box className="flex items-center gap-4 mb-3">
                <Avatar
                  src={logoPreview}
                  sx={{ width: 80, height: 80 }}
                  variant="rounded"
                >
                  {!logoPreview && (formData.logo || '')}
                </Avatar>
                
                {/* Input file caché */}
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                
                {/* Bouton pour déclencher l'upload */}
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
                </label>
              </Box>

              {/* Emoji alternatif si pas d'image */}
              <div className="mt-3">
                <label htmlFor="logo-emoji" className="block text-sm font-medium text-gray-700 mb-1">
                  Ou utilisez un emoji
                </label>
                <input
                  type="text"
                  id="logo-emoji"
                  value={formData.logo}
                  onChange={(e) => {
                    handleChange('logo', e.target.value);
                    setLogoPreview('');
                    setLogoFile(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 🏢, 💰, 🏥, 🎓"
                  maxLength={2}
                />
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Formats acceptés: JPG, PNG, GIF, WebP. Taille max: 5MB
              </p>
            </div>

            {/* Site Web */}
            <div className="w-full">
              <label htmlFor="siteWeb" className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                type="url"
                id="siteWeb"
                value={formData.siteWeb}
                onChange={(e) => handleChange('siteWeb', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemple.com"
              />
            </div>

            {/* Contact */}
            <div className="w-full">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <input
                type="text"
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email ou téléphone"
              />
            </div>
          </Box>
        </DialogContent>

        <DialogActions className="p-4 gap-2">
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            {mode === 'create' ? 'Créer' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PartenaireForm;