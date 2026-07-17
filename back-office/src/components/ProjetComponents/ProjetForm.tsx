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
  TextField,
  Chip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImage } from '../../services';
import type { Projet, ProjetFormData } from '../../types/projet.types';
import { PROJET_TYPES, DEFAULT_FORM_DATA } from '../../constants/projet.constants';

interface ProjetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjetFormData) => void;
  initialData?: Projet | null;
  mode: 'create' | 'edit';
}

interface FormErrors {
  titre?: string;
  description?: string;
  type?: string;
  date?: string;
  partenaires?: string;
}

const ProjetForm: React.FC<ProjetFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ProjetFormData>(DEFAULT_FORM_DATA);
  const [partenairesInput, setPartenairesInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        const imageUrl = initialData.image || '';
        setFormData({
          titre: initialData.titre,
          type: initialData.type,
          date: initialData.date,
          description: initialData.description,
          partenaires: initialData.partenaires,
          image: imageUrl,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          ville: initialData.ville,
          pays: initialData.pays,
          adresse: initialData.adresse,
        });
        setImagePreview(imageUrl);
      } else {
        setFormData(DEFAULT_FORM_DATA);
        setImagePreview('');
      }
      setPartenairesInput('');
      setErrors({});
      setTouched({});
    }
  }, [open, mode, initialData]);

  const validate = (data: ProjetFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    } else if (data.titre.trim().length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!data.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (data.description.trim().length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!data.type) {
      newErrors.type = 'Le type est requis';
    }

    if (!data.date) {
      newErrors.date = 'La date est requise';
    }

    return newErrors;
  };

  const handleChange = (field: keyof ProjetFormData, value: string | string[] | number | undefined) => {
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

  const handleAddPartenaire = () => {
    if (partenairesInput.trim()) {
      setFormData({
        ...formData,
        partenaires: [...formData.partenaires, partenairesInput.trim()],
      });
      setPartenairesInput('');
    }
  };

  const handleRemovePartenaire = (index: number) => {
    setFormData({
      ...formData,
      partenaires: formData.partenaires.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    Object.keys(DEFAULT_FORM_DATA).forEach((key) => {
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

  const isFormTitle = mode === 'create' ? 'Nouveau projet' : 'Modifier le projet';

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
            {/* Informations générales */}
            <Box>
              <Typography variant="h6" className="font-semibold mb-3">
                Informations générales
              </Typography>

              {/* Title */}
              <div className="w-full mb-4">
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
                  placeholder="Entrez le titre du projet"
                />
                {errors.titre && <p className="mt-1 text-sm text-red-500">{errors.titre}</p>}
              </div>

              {/* Row: Type + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormControl fullWidth error={Boolean(errors.type)} required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Type"
                    onChange={(e) => handleChange('type', e.target.value)}
                    onBlur={() => handleBlur('type')}
                    sx={{ borderRadius: '8px' }}
                  >
                    {PROJET_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                </FormControl>

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
                  placeholder="Entrez la description du projet"
                />
                {(errors.description || formData.description.length > 0) && (
                  <p className={`mt-1 text-sm ${errors.description ? 'text-red-500' : 'text-gray-500'}`}>
                    {errors.description || `${formData.description.length} caractère(s)`}
                  </p>
                )}
              </div>
            </Box>

            {/* Partenaires et Image */}
            <Box>
              <Typography variant="h6" className="font-semibold mb-3">
                Partenaires et média
              </Typography>

              {/* Partenaires */}
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partenaires
                </label>
                <div className="flex gap-2 mb-2">
                  <TextField
                    size="small"
                    value={partenairesInput}
                    onChange={(e) => setPartenairesInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPartenaire();
                      }
                    }}
                    placeholder="Ajouter un partenaire"
                    sx={{ flex: 1 }}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleAddPartenaire}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.partenaires.map((partenaire, index) => (
                    <Chip
                      key={index}
                      label={partenaire}
                      onDelete={() => handleRemovePartenaire(index)}
                      sx={{ borderRadius: '6px' }}
                    />
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
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
                  value={formData.image || ''}
                  onChange={(e) => handleChange('image', e.target.value)}
                />
              </div>
            </Box>

            {/* Localisation */}
            <Box>
              <Typography variant="h6" className="font-semibold mb-3">
                Localisation du projet (optionnel)
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="ville" className="block text-xs font-medium text-gray-600 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="ville"
                    value={formData.ville ?? ''}
                    onChange={(e) => handleChange('ville', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Fianarantsoa"
                  />
                </div>
                <div>
                  <label htmlFor="pays" className="block text-xs font-medium text-gray-600 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    id="pays"
                    value={formData.pays ?? ''}
                    onChange={(e) => handleChange('pays', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Madagascar"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="adresse" className="block text-xs font-medium text-gray-600 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  value={formData.adresse ?? ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 123 Rue Example"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-gray-600 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    step="any"
                    value={formData.latitude ?? ''}
                    onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 48.8566"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-gray-600 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    step="any"
                    value={formData.longitude ?? ''}
                    onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 2.3522"
                  />
                </div>
              </div>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className="p-4 gap-2">
          <Button
            type="button"
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Annuler
          </Button>
          <Box className="flex-1" />
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            {mode === 'create' ? '✓ Créer le projet' : '✓ Enregistrer les modifications'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjetForm;