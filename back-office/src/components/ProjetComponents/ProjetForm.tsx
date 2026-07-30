import React, { useRef, useState, useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info";
import WorkIcon from "@mui/icons-material/Work";
import PublicIcon from "@mui/icons-material/Public";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadImage } from "../../services";
import type { Projet, ProjetFormData } from "../../types/projet.types";
import { PROJET_TYPES, DEFAULT_FORM_DATA } from "../../constants/projet.constants";
import { useFormValidation } from "../../hooks/useFormValidation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { FloatingSelect } from "@/components/ui/floating-select";

interface ProjetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjetFormData) => void;
  initialData?: Projet | null;
  mode: "create" | "edit";
}

const STEPS = [
  {
    id: 0,
    label: "Informations",
    icon: <InfoIcon className="h-4 w-4" />,
  },
  {
    id: 1,
    label: "Détails",
    icon: <WorkIcon className="h-4 w-4" />,
  },
  {
    id: 2,
    label: "Publication",
    icon: <PublicIcon className="h-4 w-4" />,
  },
];

type ProjetField = keyof ProjetFormData;

const STEP_FIELDS_MAP: Record<number, ProjetField[]> = {
  0: ["titre", "type", "date"],
  1: ["description"],
  2: ["ville", "pays", "adresse"],
};

const ProjetForm: React.FC<ProjetFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [partenairesInput, setPartenairesInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const { formData, errors, activeStep, setActiveStep, handleChange, handleBlur, validateStep, validateAllSteps, setFormData, resetForm } = useFormValidation<ProjetFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    validators: {
      titre: {
        required: true,
        minLength: { value: 5, message: "Le titre doit contenir au moins 5 caractères" },
      },
      description: {
        required: true,
        minLength: { value: 20, message: "La description doit contenir au moins 20 caractères" },
      },
      type: { required: true },
      date: { required: true },
    },
    stepFields: STEP_FIELDS_MAP,
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        const imageUrl = initialData.image || "";
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
        resetForm();
        setImagePreview("");
      }
      setPartenairesInput("");
    }
  }, [open, mode, initialData, setFormData, resetForm]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      handleChange("image", url);
      setImagePreview(url);
    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddPartenaire = () => {
    if (partenairesInput.trim()) {
      handleChange("partenaires", [...formData.partenaires, partenairesInput.trim()]);
      setPartenairesInput("");
    }
  };

  const handleRemovePartenaire = (index: number) => {
    handleChange(
      "partenaires",
      formData.partenaires.filter((_, i) => i !== index)
    );
  };

  const handleNext = () => {
    if (validateStep(activeStep))
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleStepClick = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
    } else if (step > activeStep) {
      let canAdvance = true;
      for (let i = activeStep; i < step; i++) {
        if (!validateStep(i)) {
          setActiveStep(i);
          canAdvance = false;
          break;
        }
      }
      if (canAdvance) setActiveStep(step);
    }
  };

  const handleSubmit = () => {
    if (validateAllSteps()) onSubmit(formData);
  };

  const dialogTitle =
    mode === "create" ? "Nouveau projet" : "Modifier le projet";

  /* ─── Step 0 : Informations générales ─── */
  const renderStep0 = () => (
    <div className="space-y-4">
      <FloatingInput
        id="titre"
        label="Titre *"
        value={formData.titre}
        onChange={(e) => handleChange("titre", e.target.value)}
        onBlur={() => handleBlur("titre")}
        error={errors.titre}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingSelect
          label="Type *"
          value={formData.type}
          onValueChange={(v, _eventDetails) => v && handleChange("type", v)}
          options={[...PROJET_TYPES]}
          error={errors.type}
        />
        <FloatingInput
          id="date"
          label="Date *"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          onBlur={() => handleBlur("date")}
          error={errors.date}
        />
      </div>
    </div>
  );

  /* ─── Step 1 : Détails ─── */
  const renderStep1 = () => (
    <div className="space-y-4">
      <FloatingTextarea
        id="description"
        label="Description *"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        onBlur={() => handleBlur("description")}
        rows={5}
        error={errors.description}
        hint={
          !errors.description
            ? `${formData.description.length} caractère(s)`
            : undefined
        }
      />

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <WorkIcon className="h-4 w-4 text-gray-400" />
          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Partenaires
          </Label>
        </div>
        <div className="flex gap-2 mb-2">
          <FloatingInput
            id="partenaire"
            label="Nouveau partenaire"
            value={partenairesInput}
            onChange={(e) => setPartenairesInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPartenaire();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddPartenaire}
            className="mt-6"
            size="sm"
          >
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.partenaires.map((partenaire, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {partenaire}
              <button
                type="button"
                onClick={() => handleRemovePartenaire(index)}
                className="ml-1 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── Step 2 : Publication ─── */
  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Image */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Image de couverture
        </Label>
        <div className="flex items-start gap-3">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-28 h-20 object-cover rounded-md border border-gray-200 shrink-0"
              onError={() => setImagePreview("")}
            />
          )}
          <div className="flex flex-col gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              size="sm"
              className="gap-1.5 bg-white text-xs h-8"
            >
              <CloudUploadIcon className="h-3.5 w-3.5" />
              {uploadingImage ? "Upload..." : "Choisir une image"}
            </Button>
            <span className="text-[10px] text-gray-400">
              JPG, PNG, GIF, WebP — max 5 Mo
            </span>
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 mb-2">
          <PublicIcon className="h-4 w-4 text-gray-400" />
          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Localisation (optionnel)
          </Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FloatingInput
            id="ville"
            label="Ville"
            value={formData.ville || ""}
            onChange={(e) => handleChange("ville", e.target.value)}
          />
          <FloatingInput
            id="pays"
            label="Pays"
            value={formData.pays || ""}
            onChange={(e) => handleChange("pays", e.target.value)}
          />
        </div>

        <FloatingInput
          id="adresse"
          label="Adresse"
          value={formData.adresse || ""}
          onChange={(e) => handleChange("adresse", e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FloatingInput
            id="latitude"
            label="Latitude"
            type="number"
            step="any"
            value={formData.latitude?.toString() || ""}
            onChange={(e) =>
              handleChange("latitude", e.target.value ? parseFloat(e.target.value) : undefined)
            }
          />
          <FloatingInput
            id="longitude"
            label="Longitude"
            type="number"
            step="any"
            value={formData.longitude?.toString() || ""}
            onChange={(e) =>
              handleChange("longitude", e.target.value ? parseFloat(e.target.value) : undefined)
            }
          />
        </div>
      </div>
    </div>
  );

  const stepRenderers = [renderStep0, renderStep1, renderStep2];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="
          sm:max-w-3xl
          w-[95vw]
          bg-white
          p-0
          gap-0
          overflow-hidden
          [&>button]:hidden
        "
      >
        {/* ─── Header + Stepper ─── */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b bg-gray-50/80">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {dialogTitle}
          </DialogTitle>

          <div className="flex items-center justify-center gap-1 mt-3">
            {STEPS.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;

              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <div
                      className={`hidden sm:block h-px w-8 transition-colors ${
                        isCompleted ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-xs font-medium transition-all
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : isCompleted
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </DialogHeader>

        {/* ─── Body ─── */}
        <div className="px-5 py-4 overflow-y-auto max-h-[58vh]">
          {stepRenderers[activeStep]()}
        </div>

        {/* ─── Footer ─── */}
        <DialogFooter className="px-5 py-3 mb-4 mx-4 border-t bg-gray-50/80">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-400">
              {activeStep + 1}/{STEPS.length}
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 h-8"
              >
                Annuler
              </Button>

              {activeStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="gap-1 h-8"
                >
                  <ArrowBackIcon className="h-3.5 w-3.5" />
                  Précédent
                </Button>
              )}

              {activeStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="gap-1 h-8 bg-blue-600 hover:bg-blue-700"
                >
                  Suivant
                  <ArrowForwardIcon className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  className="gap-1 h-8 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  {mode === "create" ? "Créer" : "Enregistrer"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjetForm;