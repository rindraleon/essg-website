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
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ObjectiveIcon from '@mui/icons-material/Flag';
import WorkIcon from '@mui/icons-material/Work';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoIcon from '@mui/icons-material/Info';
import { getImageUrl } from '../../utils/image.utils';
import { uploadImage } from '../../services';
import type { Formation, FormationFormData } from '../../types/formation.types';

interface FormationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormationFormData) => void;
  initialData?: Formation | null;
  mode: 'create' | 'edit';
}

interface FormErrors {
  titre?: string;
  domaine?: string;
  niveau?: string;
  duree?: string;
  description?: string;
  credits?: string;
  slug?: string;
  responsable?: string;
  email?: string;
  objectifs?: string;
  debouches?: string;
}

const DOMAINE_OPTIONS = [
  'Informatique',
  'Gestion',
  'Droit',
  'Médecine',
  'Ingénierie',
  'Sciences',
  'Lettres',
  'Économie',
  'Autre',
];

const DUREE_OPTIONS = [
  '2 ans',
  '3 ans',
  '4 ans',
  '5 ans',
  '2 semestres',
  '4 semestres',
  '6 semestres',
  '8 semestres',
  'Autre',
];

const CONDITIONS_ACCES_OPTIONS = [
  'Baccalauréat',
  'Baccalauréat + 2 ans',
  'Baccalauréat + 3 ans',
  'Master',
  'Doctorat',
  'Expérience professionnelle',
  'Concours',
  'Dossier',
  'Autre',
];

const defaultFormData: FormationFormData = {
  slug: '',
  domaine: [],
  titre: '',
  niveau: 'Licence',
  duree: '',
  description: '',
  objectifs: [''],
  debouches: [''],
  conditionsAcces: '',
  conditions: [''],
  competences: [''],
  modules: [''],
  programme: [''],
  image: '/images/hero-campus.jpg',
  enVedette: false,
  credits: 180,
  responsable: '',
  email: '',
};

const FormationForm: React.FC<FormationFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<FormationFormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        const { id, creeLe, misAJourLe, ...formDataWithoutId } = initialData as any;
        setFormData(formDataWithoutId);
        setImagePreview(getImageUrl(formDataWithoutId.image));
      } else {
        setFormData(defaultFormData);
        setImagePreview('');
      }
      setErrors({});
      setTouched({});
    }
  }, [open, mode, initialData]);

  const validateForm = (data: FormationFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    } else if (data.titre.trim().length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!data.domaine || data.domaine.length === 0) {
      newErrors.domaine = 'Le domaine est requis';
    }

    if (!data.niveau) {
      newErrors.niveau = 'Le niveau est requis';
    }

    if (!data.duree.trim()) {
      newErrors.duree = 'La durée est requise';
    }

    if (!data.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (data.description.trim().length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!data.slug.trim()) {
      newErrors.slug = 'Le slug est requis';
    }

    if (!data.credits || data.credits <= 0) {
      newErrors.credits = 'Le nombre de crédits doit être supérieur à 0';
    }

    const validObjectifs = data.objectifs.filter((obj) => obj.trim() !== '');
    if (validObjectifs.length === 0) {
      newErrors.objectifs = 'Au moins un objectif est requis';
    }

    const validDebouches = data.debouches.filter((deb) => deb.trim() !== '');
    if (validDebouches.length === 0) {
      newErrors.debouches = 'Au moins un débouché est requis';
    }

    if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email invalide';
    }

    return newErrors;
  };

  const handleChange = (field: keyof FormationFormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    if (touched[field]) {
      const fieldErrors = validateForm(newData);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field as keyof FormErrors],
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateForm(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field as keyof FormErrors],
    }));
  };

  const handleArrayChange = (
    field: 'objectifs' | 'debouches' | 'programme' | 'conditions' | 'competences',
    index: number,
    value: string
  ) => {
    const currentArray = formData[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const addArrayItem = (
    field: 'objectifs' | 'debouches' | 'programme' | 'conditions' | 'competences'
  ) => {
    const currentArray = formData[field] || [];
    handleChange(field, [...currentArray, '']);
  };

  const removeArrayItem = (
    field: 'objectifs' | 'debouches' | 'programme' | 'conditions' | 'competences',
    index: number
  ) => {
    const currentArray = formData[field] || [];
    if (currentArray.length > 1) {
      const newArray = currentArray.filter((_, i) => i !== index);
      handleChange(field, newArray);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    Object.keys(defaultFormData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const allErrors = validateForm(formData);
    setErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const isFormTitle = mode === 'create' ? 'Nouvelle formation' : 'Modifier la formation';

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
              <Typography variant="h6" className="font-semibold mb-3 flex items-center gap-2">
                <InfoIcon sx={{ color: '#3b82f6' }} />
                Informations générales
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Titre *"
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  onBlur={() => handleBlur('titre')}
                  error={Boolean(errors.titre)}
                  helperText={errors.titre}
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Slug *"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  onBlur={() => handleBlur('slug')}
                  error={Boolean(errors.slug)}
                  helperText={errors.slug}
                  fullWidth
                  size="small"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <FormControl fullWidth size="small" error={Boolean(errors.domaine)}>
                  <InputLabel>Domaines *</InputLabel>
                  <Select
                    multiple
                    value={formData.domaine}
                    label="Domaines *"
                    onChange={(e) => handleChange('domaine', e.target.value)}
                    onBlur={() => handleBlur('domaine')}
                    renderValue={(selected) => (
                      <Box className="flex flex-wrap gap-1">
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" sx={{ height: 24 }} />
                        ))}
                      </Box>
                    )}
                  >
                    {DOMAINE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth size="small" error={Boolean(errors.niveau)}>
                  <InputLabel>Niveau *</InputLabel>
                  <Select
                    value={formData.niveau}
                    label="Niveau *"
                    onChange={(e) => handleChange('niveau', e.target.value)}
                    onBlur={() => handleBlur('niveau')}
                  >
                    <MenuItem value="Licence">Licence</MenuItem>
                    <MenuItem value="Master">Master</MenuItem>
                    <MenuItem value="Doctorat">Doctorat</MenuItem>
                  </Select>
                  {errors.niveau && <FormHelperText>{errors.niveau}</FormHelperText>}
                </FormControl>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <FormControl fullWidth size="small" error={Boolean(errors.duree)}>
                  <InputLabel>Durée *</InputLabel>
                  <Select
                    value={formData.duree}
                    label="Durée *"
                    onChange={(e) => handleChange('duree', e.target.value)}
                    onBlur={() => handleBlur('duree')}
                  >
                    {DUREE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.duree && <FormHelperText>{errors.duree}</FormHelperText>}
                </FormControl>

                <TextField
                  label="Crédits *"
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => handleChange('credits', Number.parseInt(e.target.value) || 0)}
                  onBlur={() => handleBlur('credits')}
                  error={Boolean(errors.credits)}
                  helperText={errors.credits}
                  fullWidth
                  size="small"
                />
              </div>

              <TextField
                label="Description *"
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                error={Boolean(errors.description)}
                helperText={errors.description || `${formData.description.length} caractère(s)`}
                multiline
                rows={4}
                fullWidth
                size="small"
                className="mt-4"
              />
            </Box>

            {/* Contenu pédagogique */}
            <Box>
              <Typography variant="h6" className="font-semibold mb-3 flex items-center gap-2">
                <MenuBookIcon sx={{ color: '#10b981' }} />
                Contenu pédagogique
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Objectifs */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ObjectiveIcon fontSize="small" sx={{ color: '#6b7280' }} />
                    Objectifs *
                  </label>
                  {formData.objectifs.map((objectif, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <TextField
                        value={objectif}
                        onChange={(e) => handleArrayChange('objectifs', index, e.target.value)}
                        placeholder={`Objectif ${index + 1}`}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        type="button"
                        onClick={() => removeArrayItem('objectifs', index)}
                        color="error"
                        size="small"
                        disabled={formData.objectifs.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  {errors.objectifs && (
                    <FormHelperText error>{errors.objectifs}</FormHelperText>
                  )}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('objectifs')}
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="mt-1"
                  >
                    Ajouter
                  </Button>
                </div>

                {/* Débouchés */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <WorkIcon fontSize="small" sx={{ color: '#6b7280' }} />
                    Débouchés *
                  </label>
                  {formData.debouches.map((debouche, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <TextField
                        value={debouche}
                        onChange={(e) => handleArrayChange('debouches', index, e.target.value)}
                        placeholder={`Débouché ${index + 1}`}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        type="button"
                        onClick={() => removeArrayItem('debouches', index)}
                        color="error"
                        size="small"
                        disabled={formData.debouches.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  {errors.debouches && (
                    <FormHelperText error>{errors.debouches}</FormHelperText>
                  )}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('debouches')}
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="mt-1"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Conditions d'accès */}
                <FormControl fullWidth size="small">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MenuBookIcon fontSize="small" sx={{ color: '#6b7280' }} />
                    Conditions d'accès
                  </label>
                  <Select
                    value={formData.conditionsAcces}
                    label="Conditions d'accès"
                    onChange={(e) => handleChange('conditionsAcces', e.target.value)}
                  >
                    {CONDITIONS_ACCES_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Programme */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MenuBookIcon fontSize="small" sx={{ color: '#6b7280' }} />
                    Programme
                  </label>
                  {formData.programme.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <TextField
                        value={item}
                        onChange={(e) => handleArrayChange('programme', index, e.target.value)}
                        placeholder={`Élément ${index + 1}`}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        type="button"
                        onClick={() => removeArrayItem('programme', index)}
                        color="error"
                        size="small"
                        disabled={formData.programme.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('programme')}
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="mt-1"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </Box>

            {/* Détails et publication */}
            <Box>
              <Typography variant="h6" className="font-semibold mb-3 flex items-center gap-2">
                <WorkIcon sx={{ color: '#f59e0b' }} />
                Détails et publication
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Image Upload */}
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de la formation
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Responsable"
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => handleChange('responsable', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Nom du responsable"
                />

                <TextField
                  label="Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  fullWidth
                  size="small"
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Conditions */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MenuBookIcon fontSize="small" sx={{ color: '#6b7280' }} />
                    Conditions
                  </label>
                  {(formData.conditions || []).map((condition, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <TextField
                        value={condition}
                        onChange={(e) => handleArrayChange('conditions', index, e.target.value)}
                        placeholder={`Condition ${index + 1}`}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        type="button"
                        onClick={() => removeArrayItem('conditions', index)}
                        color="error"
                        size="small"
                        disabled={(formData.conditions || []).length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('conditions')}
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="mt-1"
                  >
                    Ajouter
                  </Button>
                </div>

                {/* Compétences */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ObjectiveIcon fontSize="small" sx={{ color: '#6b7280' }} />
                    Compétences
                  </label>
                  {(formData.competences || []).map((competence, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <TextField
                        value={competence}
                        onChange={(e) => handleArrayChange('competences', index, e.target.value)}
                        placeholder={`Compétence ${index + 1}`}
                        fullWidth
                        size="small"
                      />
                      <IconButton
                        type="button"
                        onClick={() => removeArrayItem('competences', index)}
                        color="error"
                        size="small"
                        disabled={(formData.competences || []).length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('competences')}
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="mt-1"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Modules */}
              <div className="w-full mt-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MenuBookIcon fontSize="small" sx={{ color: '#6b7280' }} />
                  Modules
                </label>
                {(formData.modules || []).map((module, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <TextField
                      value={module as string}
                      onChange={(e) => {
                        const currentModules = formData.modules || [];
                        const newModules = [...currentModules];
                        newModules[index] = e.target.value;
                        handleChange('modules', newModules);
                      }}
                      placeholder={`Module ${index + 1}`}
                      fullWidth
                      size="small"
                    />
                    <IconButton
                      type="button"
                      onClick={() => {
                        const currentModules = formData.modules || [];
                        if (currentModules.length > 1) {
                          const newModules = currentModules.filter((_, i) => i !== index);
                          handleChange('modules', newModules);
                        }
                      }}
                      color="error"
                      size="small"
                      disabled={(formData.modules || []).length === 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => handleChange('modules', [...(formData.modules || []), ''])}
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="mt-1"
                >
                  Ajouter
                </Button>
              </div>

              {/* En Vedette */}
              <div className="flex items-center gap-2 mt-4">
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
            color="success"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            {mode === 'create' ? '✓ Créer la formation' : '✓ Enregistrer les modifications'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormationForm;