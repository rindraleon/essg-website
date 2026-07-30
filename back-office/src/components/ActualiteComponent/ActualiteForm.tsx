// src/components/actualites/ActualiteForm.tsx
import React, { useRef, useState, useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import PublicIcon from "@mui/icons-material/Public";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadImage } from "../../services";
import type { ActualiteItem, ActualiteFormData } from "../../types/actualite.types";
import { categories, statuts } from "../../data/mockData";
import { useFormValidation } from "../../hooks/useFormValidation";
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

interface ActualiteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ActualiteFormData) => void;
  initialData?: ActualiteItem | null;
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
    label: "Contenu",
    icon: <EditIcon className="h-4 w-4" />,
  },
  {
    id: 2,
    label: "Publication",
    icon: <PublicIcon className="h-4 w-4" />,
  },
];

type ActualiteField = keyof ActualiteFormData;

const STEP_FIELDS_MAP: Record<number, ActualiteField[]> = {
  0: ["titre", "categorie", "auteur", "date"],
  1: ["contenu", "resume"],
  2: ["statut"],
};

const defaultFormData: ActualiteFormData = {
  titre: "",
  contenu: "",
  categorie: "",
  auteur: "",
  date: new Date().toISOString().split("T")[0],
  statut: "brouillon",
  image: "",
  resume: "",
  enVedette: false,
};

const ActualiteForm: React.FC<ActualiteFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const { formData, errors, activeStep, setActiveStep, handleChange, handleBlur, validateStep, validateAllSteps, setFormData, resetForm } = useFormValidation<ActualiteFormData>({
    defaultValues: defaultFormData,
    validators: {
      titre: {
        required: true,
        minLength: { value: 5, message: "Le titre doit contenir au moins 5 caractères" },
      },
      contenu: {
        required: true,
        minLength: { value: 20, message: "Le contenu doit contenir au moins 20 caractères" },
      },
      categorie: { required: true },
      auteur: { required: true },
      date: { required: true },
      statut: { required: true },
    },
    stepFields: STEP_FIELDS_MAP,
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        const imageUrl = initialData.image || "";
        setFormData({
          titre: initialData.titre,
          contenu: initialData.contenu,
          categorie: initialData.categorie,
          auteur: initialData.auteur,
          date: initialData.date,
          statut: initialData.statut,
          image: imageUrl,
          resume: (initialData as any).resume || "",
          enVedette: (initialData as any).enVedette || true,
        });
        setImagePreview(imageUrl);
      } else {
        resetForm();
        setImagePreview("");
      }
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
    mode === "create" ? "Nouvelle actualité" : "Modifier l'actualité";

  /* ─── Step 0 : Informations générales ─── */
  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingInput
          id="titre"
          label="Titre *"
          value={formData.titre}
          onChange={(e) => handleChange("titre", e.target.value)}
          onBlur={() => handleBlur("titre")}
          error={errors.titre}
        />

        <FloatingInput
          id="auteur"
          label="Auteur *"
          value={formData.auteur}
          onChange={(e) => handleChange("auteur", e.target.value)}
          onBlur={() => handleBlur("auteur")}
          error={errors.auteur}
        />
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingSelect
          label="Catégorie *"
          value={formData.categorie}
          onValueChange={(v, _eventDetails) => v && handleChange("categorie", v)}
          options={categories.map((cat) => ({ label: cat, value: cat }))}
          error={errors.categorie}
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

  /* ─── Step 1 : Contenu ─── */
  const renderStep1 = () => (
    <div className="space-y-4">
      <FloatingTextarea
        id="contenu"
        label="Contenu *"
        value={formData.contenu}
        onChange={(e) => handleChange("contenu", e.target.value)}
        onBlur={() => handleBlur("contenu")}
        rows={8}
        error={errors.contenu}
        hint={
          !errors.contenu
            ? `${formData.contenu.length} caractère(s)`
            : undefined
        }
      />

      <FloatingTextarea
        id="resume"
        label="Résumé (optionnel)"
        value={formData.resume}
        onChange={(e) => handleChange("resume", e.target.value)}
        rows={3}
        hint="Court résumé de l'actualité"
      />
    </div>
  );

  /* ─── Step 2 : Publication ─── */
  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Image */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Image de l'actualité
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

      {/* Statut + En vedette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingSelect
          label="Statut *"
          value={formData.statut}
          onValueChange={(v, _eventDetails) => v && handleChange("statut", v)}
          options={statuts}
          error={errors.statut}
        />

        <div className="flex items-center gap-2 pt-6">
          <Checkbox
            id="enVedette"
            checked={formData.enVedette}
            onCheckedChange={(checked) =>
              handleChange("enVedette", checked as boolean)
            }
            className="bg-white"
          />
          <Label htmlFor="enVedette" className="cursor-pointer text-sm">
            Mettre en vedette
          </Label>
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

export default ActualiteForm;