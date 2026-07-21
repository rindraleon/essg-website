import React, { useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import type { SelectChangeEvent } from "@mui/material/Select";
import { GREEN } from "../../constants/colors";
import type { AdmissionFormData, AdmissionFormProps } from "../../types/admission.types";

const INITIAL_FORM_DATA: AdmissionFormData = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    niveau: "",
    formation: "",
    diplomePrecedent: "",
    accepteConditions: false,
};

const DEFAULT_NIVEAUX = [
    { value: "licence", label: "Licence" },
    { value: "master", label: "Master" },
    { value: "doctorat", label: "Doctorat" },
];

const DEFAULT_FORMATIONS = [
    { value: "geomatique-applications", label: "Géomatique et Applications" },
    { value: "geomatique-management", label: "Géomatique et Management" },
    { value: "informatique-donnees", label: "Informatique et Données Spatiales" },
];

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "0.75rem",
        "&.Mui-focused fieldset": {
            borderColor: GREEN[600],
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: GREEN[600],
    },
};

const selectSx = {
    borderRadius: "0.75rem",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: GREEN[600],
    },
};

const AdmissionForm: React.FC<AdmissionFormProps> = (
    props: Readonly<AdmissionFormProps>,
) => {
    const {
        niveaux = DEFAULT_NIVEAUX,
        formations = DEFAULT_FORMATIONS,
        onSubmit,
    } = props;

    const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            accepteConditions: e.target.checked,
        }));
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.accepteConditions) {
            setSnackbar({
                open: true,
                message: "Veuillez accepter les conditions générales.",
                severity: "error",
            });
            return;
        }

        if (onSubmit) {
            onSubmit(formData);
        }

        setSnackbar({
            open: true,
            message: "Candidature soumise avec succès ! Vous recevrez un email de confirmation.",
            severity: "success",
        });

        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <>
            <Card
                sx={{
                    borderRadius: "1rem",
                    border: "1px solid #e5e7eb",
                }}
            >
                {/* <div
                    className="h-2 w-full"
                    style={{
                        background: `linear-gradient(90deg, ${GREEN[500]}, ${GREEN[400]})`,
                    }}
                /> */}

                <CardContent className="p-6 sm:p-8">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                        Formulaire de candidature
                    </h2>
                    <p className="mb-8 text-sm text-gray-600">
                        Remplissez ce formulaire pour soumettre votre
                        candidature. Assurez-vous de fournir des informations
                        exactes.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Informations personnelles */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Informations personnelles
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField
                                    label="Nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                />

                                <TextField
                                    label="Prénom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                />

                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                />

                                <TextField
                                    label="Téléphone"
                                    name="telephone"
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                />

                                <TextField
                                    label="Date de naissance"
                                    name="dateNaissance"
                                    type="date"
                                    value={formData.dateNaissance}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        ...inputSx,
                                        gridColumn: "1 / -1",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Formation souhaitée */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Formation souhaitée
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormControl fullWidth size="small">
                                    <InputLabel
                                        id="niveau-label"
                                        sx={{
                                            "&.Mui-focused": {
                                                color: GREEN[900],
                                            },
                                        }}
                                    >
                                        Niveau *
                                    </InputLabel>
                                    <Select
                                        labelId="niveau-label"
                                        label="Niveau *"
                                        value={formData.niveau}
                                        onChange={handleSelectChange("niveau")}
                                        required
                                        sx={selectSx}
                                    >
                                        {niveaux.map((item) => (
                                            <MenuItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small">
                                    <InputLabel
                                        id="formation-label"
                                        sx={{
                                            "&.Mui-focused": {
                                                color: GREEN[900],
                                            },
                                        }}
                                    >
                                        Formation *
                                    </InputLabel>
                                    <Select
                                        labelId="formation-label"
                                        label="Formation *"
                                        value={formData.formation}
                                        onChange={handleSelectChange("formation")}
                                        required
                                        sx={selectSx}
                                    >
                                        {formations.map((item) => (
                                            <MenuItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {/* Parcours académique */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Parcours académique
                            </h3>

                            <div className="space-y-4">
                                <TextField
                                    label="Dernier diplôme obtenu"
                                    name="diplomePrecedent"
                                    value={formData.diplomePrecedent}
                                    onChange={handleTextChange}
                                    placeholder="Ex: Baccalauréat scientifique, Licence en géographie..."
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                />

                                <div>
                                    <label
                                        htmlFor="cv"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        CV (PDF) *
                                    </label>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<CloudUploadRoundedIcon />}
                                        sx={{
                                            borderRadius: "0.75rem",
                                            borderColor: "#d1d5db",
                                            color: "#6b7280",
                                            textTransform: "none",
                                            justifyContent: "flex-start",
                                            py: 1.25,
                                            "&:hover": {
                                                borderColor: GREEN[900],
                                                backgroundColor: GREEN[50],
                                            },
                                        }}
                                    >
                                        Choisir un fichier
                                        <input
                                            id="cv"
                                            type="file"
                                            accept=".pdf"
                                            hidden
                                            required
                                        />
                                    </Button>
                                </div>

                                <div>
                                    <label
                                        htmlFor="lettre"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Lettre de motivation (PDF) *
                                    </label>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<CloudUploadRoundedIcon />}
                                        sx={{
                                            borderRadius: "0.75rem",
                                            borderColor: "#d1d5db",
                                            color: "#6b7280",
                                            textTransform: "none",
                                            justifyContent: "flex-start",
                                            py: 1.25,
                                            "&:hover": {
                                                borderColor: GREEN[900],
                                                backgroundColor: GREEN[50],
                                            },
                                        }}
                                    >
                                        Choisir un fichier
                                        <input id="lettre"
                                            type="file"
                                            accept=".pdf"
                                            hidden
                                            required
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Conditions */}
                        <div
                            className="rounded-xl p-4"
                            style={{
                                backgroundColor: GREEN[50],
                                border: `1px solid ${GREEN[200]}`,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.accepteConditions}
                                        onChange={handleCheckboxChange}
                                        sx={{
                                            color: GREEN[900],
                                            "&.Mui-checked": {
                                                color: GREEN[600],
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <div>
                                        <span className="font-medium text-gray-900">
                                            J&apos;accepte les conditions
                                            générales *
                                        </span>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Je certifie que les informations
                                            fournies sont exactes et je comprends
                                            que toute fausse déclaration peut
                                            entraîner le rejet de ma candidature.
                                        </p>
                                    </div>
                                }
                            />
                        </div>

                        {/* Boutons */}
                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{
                                    borderRadius: "0.75rem",
                                    textTransform: "none",
                                    fontWeight: 800,
                                    backgroundColor: GREEN[900],
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: GREEN[700],
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Soumettre ma candidature
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                size="large"
                                startIcon={<SaveRoundedIcon />}
                                sx={{
                                    borderRadius: "0.75rem",
                                    textTransform: "none",
                                    fontWeight: 800,
                                    borderColor: GREEN[900],
                                    color: GREEN[900],
                                    "&:hover": {
                                        borderColor: GREEN[700],
                                        backgroundColor: GREEN[50],
                                    },
                                }}
                            >
                                Sauvegarder comme brouillon
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: "0.75rem" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AdmissionForm;