import React, { useState, useEffect, useRef } from "react";
import InfoIcon from "@mui/icons-material/Info";
import WorkIcon from "@mui/icons-material/Work";
import PublicIcon from "@mui/icons-material/Public";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getImageUrl } from "../../utils/image.utils";
import { uploadImage } from "../../services";
import type { RessourceHumaineItem, RessourceHumaineFormData } from "../../types/ressource-humaine.types";
import { postes } from "../../data/mockData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

interface RessourceHumaineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RessourceHumaineFormData) => void;
  initialData?: RessourceHumaineItem | null;
  mode: "create" | "edit";
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  poste?: string;
  email?: string;
  telephone?: string;
  description?: string;
  ordre?: string;
}

const STEPS = [
  {
    id: 0,
    label: "Informations",
    icon: <InfoIcon className="h-4 w-4" />,
  },
  {
    id: 1,
    label: "Contact",
    icon: <WorkIcon className="h-4 w-4" />,
  },
  {
    id: 2,
    label: "Publication",
    icon: <PublicIcon className="h-4 w-4" />,
  },
];

const STEP_FIELDS: Record<number, (keyof FormErrors)[]> = {
  0: ["nom", "prenom", "poste"],
  1: ["email", "telephone", "description"],
  2: ["ordre"],
};

const defaultFormData: RessourceHumaineFormData = {
  nom: "",
  prenom: "",
  poste: "",
  description: "",
  email: "",
  telephone: "",
  photo: "",
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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        const imageUrl = initialData.photo || "";
        setFormData({
          nom: initialData.nom,
          prenom: initialData.prenom,
          poste: initialData.poste,
          description: initialData.description || "",
          email: initialData.email || "",
          telephone: initialData.telephone || "",
          photo: imageUrl,
          actif: initialData.actif,
          ordre: initialData.ordre,
        });
        setImagePreview(imageUrl);
      } else {
        setFormData(defaultFormData);
        setImagePreview("");
      }
      setErrors({});
      setTouched({});
      setActiveStep(0);
    }
  }, [open, mode, initialData]);

  const validateForm = (data: RessourceHumaineFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (data.nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    if (!data.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (data.prenom.trim().length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

    if (!data.poste) {
      newErrors.poste = "Le poste est requis";
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Email invalide";
    }

    return newErrors;
  };

  const validateStep = (step: number): boolean => {
    const allErrors = validateForm(formData);
    const fields = STEP_FIELDS[step] || [];
    const stepErrors: FormErrors = {};
    let hasError = false;
    fields.forEach((field) => {
      if (allErrors[field]) {
        stepErrors[field] = allErrors[field];
        hasError = true;
      }
    });
    const touchedFields: Record<string, boolean> = {};
    fields.forEach((f) => (touchedFields[f] = true));
    setTouched((prev) => ({ ...prev, ...touchedFields }));
    setErrors((prev) => {
      const updated = { ...prev };
      fields.forEach((f) => {
        if (stepErrors[f]) updated[f] = stepErrors[f];
        else delete updated[f];
      });
      return updated;
    });
    return !hasError;
  };

  const validateAllSteps = (): boolean => {
    const allErrors = validateForm(formData);
    const allTouched: Record<string, boolean> = {};
    Object.keys(defaultFormData).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      for (let i = 0; i < STEPS.length; i++) {
        const fields = STEP_FIELDS[i] || [];
        if (fields.some((f) => allErrors[f])) {
          setActiveStep(i);
          return false;
        }
      }
      return false;
    }
    return true;
  };

  const handleChange = (field: keyof RessourceHumaineFormData, value: any) => {
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      handleChange("photo", url);
      setImagePreview(url);
    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
    } finally {
      setUploadingImage(false);
    }
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
    mode === "create"
      ? "Nouvelle ressource humaine"
      : "Modifier la ressource humaine";

  /* ─── Step 0 : Informations personnelles ─── */
  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingInput
          id="nom"
          label="Nom *"
          value={formData.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          onBlur={() => handleBlur("nom")}
          error={errors.nom}
        />
        <FloatingInput
          id="prenom"
          label="Prénom *"
          value={formData.prenom}
          onChange={(e) => handleChange("prenom", e.target.value)}
          onBlur={() => handleBlur("prenom")}
          error={errors.prenom}
        />
      </div>

      <FloatingSelect
        label="Poste *"
        value={formData.poste}
        onValueChange={(v) => handleChange("poste", v)}
        options={postes.map((poste) => ({ label: poste, value: poste }))}
        error={errors.poste}
      />

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Photo de profil
        </Label>
        <div className="flex items-start gap-3">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-24 h-24 object-cover rounded-md border border-gray-200 shrink-0"
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
              {uploadingImage ? "Upload..." : "Choisir une photo"}
            </Button>
            <span className="text-[10px] text-gray-400">
              JPG, PNG, GIF, WebP — max 5 Mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Step 1 : Contact et description ─── */
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          placeholder="email@exemple.com"
        />
        <FloatingInput
          id="telephone"
          label="Téléphone"
          value={formData.telephone}
          onChange={(e) => handleChange("telephone", e.target.value)}
          placeholder="+261 34 00 000 00"
        />
      </div>

      <FloatingTextarea
        id="description"
        label="Description (optionnel)"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        rows={5}
        placeholder="Description du poste, compétences, expériences..."
      />
    </div>
  );

  /* ─── Step 2 : Publication ─── */
  const renderStep2 = () => (
    <div className="space-y-4">
      <FloatingInput
        id="ordre"
        label="Ordre d'affichage"
        type="number"
        value={formData.ordre.toString()}
        onChange={(e) => handleChange("ordre", parseInt(e.target.value) || 0)}
        min="0"
      />
      <p className="text-xs text-gray-500 -mt-2">
        Les ressources avec un ordre plus petit apparaissent en premier
      </p>

      <div className="flex items-center gap-2">
        <Checkbox
          id="actif"
          checked={formData.actif}
          onCheckedChange={(checked) =>
            handleChange("actif", checked as boolean)
          }
          className="bg-white"
        />
        <Label htmlFor="actif" className="cursor-pointer text-sm">
          Ressource active
        </Label>
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

export default RessourceHumaineForm;