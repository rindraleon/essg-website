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
import type { RessourceHumaineItem, RessourceHumaineFormData } from '../../types/ressource-humaine.types';
import { postes } from '../../data/mockData';

interface RessourceHumaineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RessourceHumaineFormData) => void;
  initialData?: RessourceHumaineItem | null;
  mode: 'create' | 'edit';
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  poste?: string;
  email?: string;
  telephone?: string;
  description?: string;
}

const defaultFormData: RessourceHumaineFormData = {
  nom: '',
  prenom: '',
  poste: '',
  description: '',
  email: '',
  telephone: '',
  photo: '',
  actif: true,
  ordre: 0,
};

const RessourceHumaineForm: React.FC<RessourceHumaineFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<RessourceHumaineFormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        const imageUrl = initialData.photo || '';
        setFormData({
          nom: initialData.nom,
          prenom: initialData.prenom,
          poste: initialData.poste,
          description: initialData.description || '',
          email: initialData.email || '',
          telephone: initialData.telephone || '',
          photo: imageUrl,
          actif: initialData.actif,
          ordre: initialData.ordre,
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

  const validate = (data: RessourceHumaineFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (data.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!data.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (data.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!data.poste) {
      newErrors.poste = 'Le poste est requis';
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Email invalide';
    }

    return newErrors;
  };

  const handleChange = (field: keyof RessourceHumaineFormData, value: string | number | boolean) => {
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
      handleChange('photo', imageUrl);
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

  const isFormTitle = mode === 'create' ? 'Nouvelle ressource humaine' : 'Modifier la ressource humaine';

  const steps = ['Informations personnelles', 'Contact et description', 'Publication'];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box className="space-y-5">
            {/* Nom + Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Nom de famille"
                />
                {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
              </div>

              <div className="w-full">
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  onBlur={() => handleBlur('prenom')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.prenom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Prénom"
                />
                {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
              </div>
            </div>

            {/* Poste */}
            <div className="w-full">
              <label htmlFor="poste" className="block text-sm font-medium text-gray-700 mb-1">
                Poste <span className="text-red-500">*</span>
              </label>
              <FormControl fullWidth error={Boolean(errors.poste)}>
                <InputLabel>Poste</InputLabel>
                <Select
                  value={formData.poste}
                  label="Poste"
                  onChange={(e) => handleChange('poste', e.target.value)}
                  onBlur={() => handleBlur('poste')}
                  sx={{ borderRadius: '8px' }}
                >
                  {postes.map((poste) => (
                    <MenuItem key={poste} value={poste}>
                      {poste}
                    </MenuItem>
                  ))}
                </Select>
                {errors.poste && <FormHelperText>{errors.poste}</FormHelperText>}
              </FormControl>
            </div>

            {/* Photo Upload */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo de profil
              </label>

              {imagePreview && (
                <Box className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
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
                  {uploadingImage ? '⏳ Upload en cours...' : '📁 Sélectionner une photo'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              </Box>

              <input
                type="hidden"
                id="photo"
                value={formData.photo}
                onChange={(e) => handleChange('photo', e.target.value)}
              />
            </div>
          </Box>
        );

      case 1:
        return (
          <Box className="space-y-5">
            {/* Email + Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@exemple.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="w-full">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+261 34 00 000 00"
                />
              </div>
            </div>

            {/* Description */}
            <div className="w-full">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description du poste, compétences, expériences..."
              />
            </div>
          </Box>
        );

      case 2:
        return (
          <Box className="space-y-5">
            {/* Ordre + Actif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label htmlFor="ordre" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  id="ordre"
                  value={formData.ordre}
                  onChange={(e) => handleChange('ordre', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Les ressources avec un ordre plus petit apparaissent en premier
                </p>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="actif"
                    checked={formData.actif}
                    onChange={(e) => handleChange('actif', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="actif" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Ressource active
                  </label>
                </div>
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

export default RessourceHumaineForm;