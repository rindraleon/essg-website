// src/components/formations/FormationForm.tsx
import React, { useState, useEffect, useRef } from "react";
import ObjectiveIcon from "@mui/icons-material/Flag";
import WorkIcon from "@mui/icons-material/Work";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getImageUrl } from "../../utils/image.utils";
import { uploadImage } from "../../services";
import type {
  FormationFormData,
  FormationFormProps,
  FormErrors,
} from "../../types";
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
import DynamicListField from "../common/DynamicListField";

const DOMAINE_OPTIONS = [
  { label: "Informatique", value: "Informatique" },
  { label: "Ingénierie", value: "Ingénierie" },
  { label: "Sciences", value: "Sciences" },
  { label: "Autre", value: "Autre" },
];

const DUREE_OPTIONS = [
  { label: "2 ans", value: "2 ans" },
  { label: "3 ans", value: "3 ans" },
  { label: "5 ans", value: "5 ans" },
];

const NIVEAU_OPTIONS = [
  { label: "Licence", value: "Licence" },
  { label: "Master", value: "Master" },
  { label: "Doctorat", value: "Doctorat" },
];

const CONDITIONS_ACCES_OPTIONS = [
  { label: "Baccalauréat scientifique", value: "Baccalauréat scientifique" },
  { label: "Baccalauréat + 2 ans", value: "Baccalauréat + 2 ans" },
  { label: "Baccalauréat + 3 ans", value: "Baccalauréat + 3 ans" },
  { label: "Master", value: "Master" },
  { label: "Expérience professionnelle", value: "Expérience professionnelle" },
  { label: "Concours", value: "Concours" },
  { label: "Dossier", value: "Dossier" },
  { label: "Autre", value: "Autre" },
];

const STEPS = [
  {
    id: 0,
    label: "Informations",
    icon: <InfoIcon className="h-4 w-4" />,
  },
  {
    id: 1,
    label: "Pédagogie",
    icon: <MenuBookIcon className="h-4 w-4" />,
  },
  {
    id: 2,
    label: "Détails",
    icon: <WorkIcon className="h-4 w-4" />,
  },
];

const STEP_FIELDS: Record<number, (keyof FormErrors)[]> = {
  0: ["titre", "slug", "domaine", "niveau", "duree", "credits", "description"],
  1: ["objectifs", "debouches"],
  2: ["email", "responsable"],
};

const defaultFormData: FormationFormData = {
  slug: "",
  domaine: [],
  titre: "",
  niveau: "Licence",
  duree: "",
  description: "",
  objectifs: [""],
  debouches: [""],
  conditionsAcces: "",
  conditions: [""],
  competences: [""],
  modules: [""],
  programme: [""],
  image: "",
  enVedette: false,
  credits: 180,
  responsable: "",
  email: "",
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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        const {
          id: _id,
          creeLe: _c,
          misAJourLe: _m,
          ...rest
        } = initialData as any;
        setFormData(rest);
        setImagePreview(getImageUrl(rest.image));
      } else {
        setFormData(defaultFormData);
        setImagePreview("");
      }
      setErrors({});
      setTouched({});
      setActiveStep(0);
    }
  }, [open, mode, initialData]);

  const validateForm = (data: FormationFormData): FormErrors => {
    const e: FormErrors = {};
    if (!data.titre.trim()) e.titre = "Le titre est requis";
    else if (data.titre.trim().length < 5)
      e.titre = "Min. 5 caractères";
    if (!data.domaine || data.domaine.length === 0)
      e.domaine = "Le domaine est requis";
    if (!data.niveau) e.niveau = "Le niveau est requis";
    if (!data.duree.trim()) e.duree = "La durée est requise";
    if (!data.description.trim()) e.description = "La description est requise";
    else if (data.description.trim().length < 20)
      e.description = "Min. 20 caractères";
    if (!data.slug.trim()) e.slug = "Le slug est requis";
    if (!data.credits || data.credits <= 0) e.credits = "Doit être > 0";
    if (data.objectifs.filter((o) => o.trim()).length === 0)
      e.objectifs = "Au moins un objectif requis";
    if (data.debouches.filter((d) => d.trim()).length === 0)
      e.debouches = "Au moins un débouché requis";
    if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Email invalide";
    return e;
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
    field:
      | "objectifs"
      | "debouches"
      | "programme"
      | "conditions"
      | "competences"
      | "modules",
    index: number,
    value: string
  ) => {
    const arr = [...(formData[field] || [])];
    arr[index] = value;
    handleChange(field, arr);
  };

  const addArrayItem = (
    field:
      | "objectifs"
      | "debouches"
      | "programme"
      | "conditions"
      | "competences"
      | "modules"
  ) => handleChange(field, [...(formData[field] || []), ""]);

  const removeArrayItem = (
    field:
      | "objectifs"
      | "debouches"
      | "programme"
      | "conditions"
      | "competences"
      | "modules",
    index: number
  ) => {
    const arr = formData[field] || [];
    if (arr.length > 1)
      handleChange(
        field,
        arr.filter((_, i) => i !== index)
      );
  };

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
    mode === "create" ? "Nouvelle formation" : "Modifier la formation";

  /* ─── Step 0 : Informations générales ─── */
  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingInput
          id="titre"
          label="Titre de la formation *"
          value={formData.titre}
          onChange={(e) => handleChange("titre", e.target.value)}
          onBlur={() => handleBlur("titre")}
          error={errors.titre}
        />
        <FloatingInput
          id="slug"
          label="Slug *"
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          onBlur={() => handleBlur("slug")}
          error={errors.slug}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingSelect
          label="Domaine *"
          value={formData.domaine[0] || ""}
          onValueChange={(v) => handleChange("domaine", v ? [v] : [])}
          options={DOMAINE_OPTIONS}
          error={errors.domaine}
        />
        <FloatingSelect
          label="Niveau *"
          value={formData.niveau}
          onValueChange={(v) => handleChange("niveau", v)}
          options={NIVEAU_OPTIONS}
          error={errors.niveau}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingSelect
          label="Durée *"
          value={formData.duree}
          onValueChange={(v) => handleChange("duree", v)}
          options={DUREE_OPTIONS}
          error={errors.duree}
        />
        <FloatingInput
          id="credits"
          label="Crédits *"
          type="number"
          value={formData.credits}
          onChange={(e) =>
            handleChange("credits", Number.parseInt(e.target.value) || 0)
          }
          onBlur={() => handleBlur("credits")}
          error={errors.credits}
        />
      </div>

      <FloatingTextarea
        id="description"
        label="Description *"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        onBlur={() => handleBlur("description")}
        rows={3}
        error={errors.description}
        hint={
          !errors.description
            ? `${formData.description.length} caractère(s)`
            : undefined
        }
      />
    </div>
  );

  /* ─── Step 1 : Pédagogie ─── */
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ObjectiveIcon className="h-4 w-4 text-gray-400" />
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Objectifs *
            </Label>
          </div>
          <DynamicListField
            label="Objectifs"
            itemPlaceholder="Objectif"
            items={formData.objectifs}
            error={errors.objectifs}
            onAdd={() => addArrayItem("objectifs")}
            onRemove={(i) => removeArrayItem("objectifs", i)}
            onChange={(i, v) => handleArrayChange("objectifs", i, v)}
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <WorkIcon className="h-4 w-4 text-gray-400" />
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Débouchés *
            </Label>
          </div>
          <DynamicListField
            label="Débouchés"
            itemPlaceholder="Débouché"
            items={formData.debouches}
            error={errors.debouches}
            onAdd={() => addArrayItem("debouches")}
            onRemove={(i) => removeArrayItem("debouches", i)}
            onChange={(i, v) => handleArrayChange("debouches", i, v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingSelect
          label="Conditions d'accès"
          value={formData.conditionsAcces}
          onValueChange={(v) => handleChange("conditionsAcces", v)}
          options={CONDITIONS_ACCES_OPTIONS}
        />

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MenuBookIcon className="h-4 w-4 text-gray-400" />
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Programme
            </Label>
          </div>
          <DynamicListField
            label="Programme"
            itemPlaceholder="Élément"
            items={formData.programme || []}
            onAdd={() => addArrayItem("programme")}
            onRemove={(i) => removeArrayItem("programme", i)}
            onChange={(i, v) => handleArrayChange("programme", i, v)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <ObjectiveIcon className="h-4 w-4 text-gray-400" />
          <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Compétences
          </Label>
        </div>
        <DynamicListField
          label="Compétences"
          itemPlaceholder="Compétence"
          items={formData.competences || []}
          onAdd={() => addArrayItem("competences")}
          onRemove={(i) => removeArrayItem("competences", i)}
          onChange={(i, v) => handleArrayChange("competences", i, v)}
        />
      </div>
    </div>
  );

  /* ─── Step 2 : Détails ─── */
  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Image */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Image
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

      {/* Responsable + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FloatingInput
          id="responsable"
          label="Responsable"
          value={formData.responsable}
          onChange={(e) => handleChange("responsable", e.target.value)}
        />
        <FloatingInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
        />
      </div>

      {/* Conditions + Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MenuBookIcon className="h-4 w-4 text-gray-400" />
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Conditions
            </Label>
          </div>
          <DynamicListField
            label="Conditions"
            itemPlaceholder="Condition"
            items={formData.conditions || []}
            onAdd={() => addArrayItem("conditions")}
            onRemove={(i) => removeArrayItem("conditions", i)}
            onChange={(i, v) => handleArrayChange("conditions", i, v)}
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MenuBookIcon className="h-4 w-4 text-gray-400" />
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Modules
            </Label>
          </div>
          <DynamicListField
            label="Modules"
            itemPlaceholder="Module"
            items={formData.modules || []}
            onAdd={() => addArrayItem("modules")}
            onRemove={(i) => removeArrayItem("modules", i)}
            onChange={(i, v) => handleArrayChange("modules", i, v)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
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

export default FormationForm;