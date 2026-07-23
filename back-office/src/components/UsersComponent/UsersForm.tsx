import React, { useEffect, useState, useRef } from "react";
import { PhotoCamera, Delete, CloudUpload } from "@mui/icons-material";
import { getImageUrl } from "../../utils/image.utils";
import { uploadAvatar } from "../../services";
import type { User, UserFormData } from "../../types";
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
import { FloatingSelect } from "@/components/ui/floating-select";

interface UsersFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData: User | null;
  mode: "create" | "edit";
}

const ROLE_OPTIONS = [
  { label: "Administrateur", value: "admin" },
  { label: "Éditeur", value: "editeur" },
  { label: "Lecteur", value: "lecteur" },
];

const defaultFormData: UserFormData = {
  email: "",
  motDePasse: "",
  prenom: "",
  nom: "",
  role: "lecteur",
  estActif: true,
  avatar: undefined,
};

const UsersForm: React.FC<UsersFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setFormData({
          email: initialData.email,
          prenom: initialData.prenom,
          nom: initialData.nom,
          role: initialData.role,
          estActif: initialData.estActif,
          avatar: initialData.avatar,
          motDePasse: "",
        });
        setAvatarPreview(
          initialData.avatar ? getImageUrl(initialData.avatar) : null
        );
      } else {
        setFormData(defaultFormData);
        setAvatarPreview(null);
        setAvatarFile(null);
      }
      setErrors({});
      setTouched({});
    }
  }, [open, mode, initialData]);

  const validateForm = (data: UserFormData): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!data.email.trim()) e.email = "L'email est requis";
    else if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Email invalide";
    if (mode === "create" && !data.motDePasse)
      e.motDePasse = "Le mot de passe est requis";
    else if (mode === "create" && data.motDePasse && data.motDePasse.length < 6)
      e.motDePasse = "Min. 6 caractères";
    if (!data.prenom.trim()) e.prenom = "Le prénom est requis";
    if (!data.nom.trim()) e.nom = "Le nom est requis";
    return e;
  };

  const handleChange = (field: keyof UserFormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (touched[field]) {
      const fieldErrors = validateForm(newData);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field],
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateForm(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        alert(
          "Format d'image non supporté. Utilisez JPG, PNG, GIF ou WebP"
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (mode === "edit" && initialData) {
      setFormData((prev) => ({ ...prev, avatar: undefined }));
    }
  };

  const getInitials = (): string => {
    const prenom = formData.prenom || "";
    const nom = formData.nom || "";
    const firstCharPrenom = prenom.length > 0 ? prenom.charAt(0) : "";
    const firstCharNom = nom.length > 0 ? nom.charAt(0) : "";
    const initiales = `${firstCharPrenom}${firstCharNom}`.toUpperCase();
    if (initiales) return initiales;
    return "??";
  };

  const handleSubmit = async () => {
    const allErrors = validateForm(formData);
    const allTouched: Record<string, boolean> = {};
    Object.keys(defaultFormData).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    // Upload avatar first if there's a new file
    if (avatarFile && mode === "edit" && initialData) {
      try {
        setUploading(true);
        const updatedUser = await uploadAvatar(initialData.id, avatarFile);
        setFormData((prev) => ({ ...prev, avatar: updatedUser.avatar }));
        setAvatarPreview(
          updatedUser.avatar ? getImageUrl(updatedUser.avatar) : null
        );
        setAvatarFile(null);
      } catch (error) {
        console.error("Erreur lors de l'upload de l'avatar:", error);
        setUploading(false);
        return;
      }
    }

    onSubmit(formData);
    setUploading(false);
  };

  const dialogTitle =
    mode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="
          sm:max-w-2xl
          w-[95vw]
          bg-white
          p-0
          gap-0
          overflow-hidden
          [&>button]:hidden
        "
      >
        <DialogHeader className="px-5 pt-4 pb-3 border-b bg-gray-50/80">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 overflow-y-auto max-h-[58vh]">
          <div className="space-y-4">
            {/* Avatar Upload Section */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300"
                    style={{ backgroundColor: avatarPreview ? "transparent" : undefined }}
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarPreview(null)}
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-gray-600">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                      style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Delete style={{ fontSize: 14 }} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="gap-1.5 bg-white text-xs h-8"
                  >
                    <CloudUpload className="h-3.5 w-3.5" />
                    {avatarPreview ? "Changer" : "Ajouter"}
                  </Button>
                  <span className="text-[10px] text-gray-400">
                    JPG, PNG, GIF, WebP — max 5 Mo
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <FloatingInput
                  id="email"
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  disabled={mode === "edit"}
                />
                {mode === "create" && (
                  <FloatingInput
                    id="motDePasse"
                    label="Mot de passe *"
                    type="password"
                    value={formData.motDePasse}
                    onChange={(e) => handleChange("motDePasse", e.target.value)}
                    onBlur={() => handleBlur("motDePasse")}
                    error={errors.motDePasse}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloatingInput
                id="prenom"
                label="Prénom *"
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                onBlur={() => handleBlur("prenom")}
                error={errors.prenom}
              />
              <FloatingInput
                id="nom"
                label="Nom *"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                onBlur={() => handleBlur("nom")}
                error={errors.nom}
              />
            </div>

            <FloatingSelect
              label="Rôle *"
              value={formData.role}
              onValueChange={(v) => handleChange("role", v)}
              options={ROLE_OPTIONS}
              error={errors.role}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id="estActif"
                checked={formData.estActif}
                onCheckedChange={(checked) =>
                  handleChange("estActif", checked as boolean)
                }
                className="bg-white"
              />
              <Label htmlFor="estActif" className="cursor-pointer text-sm">
                Utilisateur actif
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 mb-4 mx-4 border-t bg-gray-50/80">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={uploading}
              className="text-gray-500 h-8"
            >
              Annuler
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={uploading}
              className="gap-1 h-8 bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? "Enregistrement..." : mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsersForm;