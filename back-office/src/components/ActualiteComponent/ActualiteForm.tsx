// src/components/actualites/ActualiteForm.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImage } from '../../services';
import type { ActualiteItem, ActualiteFormData } from '../../types/actualite.types';
import { categories, statuts } from '../../data/mockData';

interface ActualiteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ActualiteFormData) => void;
  initialData?: ActualiteItem | null;
  mode: 'create' | 'edit';
}

interface FormErrors {
  titre?: string;
  contenu?: string;
  categorie?: string;
  auteur?: string;
  date?: string;
  statut?: string;
}

const defaultFormData: ActualiteFormData = {
  titre: '',
  contenu: '',
  categorie: '',
  auteur: '',
  date: new Date().toISOString().split('T')[0],
  statut: 'brouillon',
  image: '',
  resume: '',
  enVedette: false,
};

const ActualiteForm: React.FC<ActualiteFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ActualiteFormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        const imageUrl = initialData.image || '';
        setFormData({
          titre: initialData.titre,
          contenu: initialData.contenu,
          categorie: initialData.categorie,
          auteur: initialData.auteur,
          date: initialData.date,
          statut: initialData.statut,
          image: imageUrl,
          resume: (initialData as any).resume || '',
          enVedette: (initialData as any).enVedette || true,
        });
        setImagePreview(imageUrl);
      } else {
        setFormData(defaultFormData);
        setImagePreview('');
      }
      setErrors({});
      setTouched({});
      setActiveStep(0);
    }
  }, [open, mode, initialData]);

  const validate = (data: ActualiteFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    } else if (data.titre.trim().length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!data.contenu.trim()) {
      newErrors.contenu = 'Le contenu est requis';
    } else if (data.contenu.trim().length < 20) {
      newErrors.contenu = 'Le contenu doit contenir au moins 20 caractères';
    }

    if (!data.categorie) {
      newErrors.categorie = 'La catégorie est requise';
    }

    if (!data.auteur.trim()) {
      newErrors.auteur = "L'auteur est requis";
    }

    if (!data.date) {
      newErrors.date = 'La date est requise';
    }

    if (!data.statut) {
      newErrors.statut = 'Le statut est requis';
    }

    return newErrors;
  };

  const handleChange = (field: keyof ActualiteFormData, value: string | boolean) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      handleChange('image', imageUrl);
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImage(false);
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    Object.keys(defaultFormData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
      onClose();
    }
  };

  const isFormTitle = mode === 'create' ? 'Nouvelle actualité' : 'Modifier l\'actualité';

  const steps = ['Informations générales', 'Contenu', 'Publication'];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box className="space-y-5">
            {/* Title */}
            <div className="w-full">
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="titre"
                value={formData.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                onBlur={() => handleBlur('titre')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.titre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Entrez le titre de l'actualité"
              />
              {errors.titre && <p className="mt-1 text-sm text-red-500">{errors.titre}</p>}
            </div>

            {/* Row: Category + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormControl fullWidth error={Boolean(errors.categorie)} required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={formData.categorie}
                  label="Catégorie"
                  onChange={(e) => handleChange('categorie', e.target.value)}
                  onBlur={() => handleBlur('categorie')}
                  sx={{ borderRadius: '8px' }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categorie && (
                  <FormHelperText>{errors.categorie}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={Boolean(errors.statut)} required>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.statut}
                  label="Statut"
                  onChange={(e) => handleChange('statut', e.target.value)}
                  onBlur={() => handleBlur('statut')}
                  sx={{ borderRadius: '8px' }}
                >
                  {statuts.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.statut && <FormHelperText>{errors.statut}</FormHelperText>}
              </FormControl>
            </div>
          </Box>
        );

      case 1:
        return (
          <Box className="space-y-5">
            {/* Content */}
            <div className="w-full">
              <label htmlFor="contenu" className="block text-sm font-medium text-gray-700 mb-1">
                Contenu <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contenu"
                value={formData.contenu}
                onChange={(e) => handleChange('contenu', e.target.value)}
                onBlur={() => handleBlur('contenu')}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contenu ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Entrez le contenu de l'actualité"
              />
              {(errors.contenu || formData.contenu.length > 0) && (
                <p className={`mt-1 text-sm ${errors.contenu ? 'text-red-500' : 'text-gray-500'}`}>
                  {errors.contenu || `${formData.contenu.length} caractère(s)`}
                </p>
              )}
            </div>

            {/* Resume */}
            <div className="w-full">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                Résumé (optionnel)
              </label>
              <textarea
                id="resume"
                value={formData.resume}
                onChange={(e) => handleChange('resume', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Court résumé de l'actualité"
              />
            </div>
          </Box>
        );

      case 2:
        return (
          <Box className="space-y-5">
            {/* Row: Author + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label htmlFor="auteur" className="block text-sm font-medium text-gray-700 mb-1">
                  Auteur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="auteur"
                  value={formData.auteur}
                  onChange={(e) => handleChange('auteur', e.target.value)}
                  onBlur={() => handleBlur('auteur')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.auteur ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nom de l'auteur"
                />
                {errors.auteur && <p className="mt-1 text-sm text-red-500">{errors.auteur}</p>}
              </div>

              <div className="w-full">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  onBlur={() => handleBlur('date')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
            </div>

            {/* Image Upload */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de l'actualité
              </label>

              {imagePreview && (
                <Box className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    onError={() => setImagePreview('')}
                  />
                </Box>
              )}

              <Box className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  size="small"
                  sx={{
                    backgroundColor: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                  }}
                >
                  {uploadingImage ? '⏳ Upload en cours...' : '📁 Sélectionner une image'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              </Box>

              <input
                type="hidden"
                id="image"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
              />

            {/* En Vedette */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enVedette"
                checked={formData.enVedette}
                onChange={(e) => handleChange('enVedette', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="enVedette" className="text-sm font-medium text-gray-700 cursor-pointer">
                Mettre en vedette
              </label>
            </div>
            </div>
          </Box>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepSubmit = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit(new Event('submit') as any);
    } else {
      handleNext();
    }
  };

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
          <Stepper activeStep={activeStep} className="mb-4">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}
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
          <Box className="flex-1" />
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Précédent
            </Button>
          )}
          <Button
            onClick={handleStepSubmit}
            variant="contained"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            {activeStep === steps.length - 1 ? (mode === 'create' ? 'Créer' : 'Enregistrer') : 'Suivant'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ActualiteForm;