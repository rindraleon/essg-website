import React, { useState } from "react";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import type { SelectChangeEvent } from "@mui/material/Select";
import { GREEN } from "../../constants/colors";
import type {
    ContactFormData,
    ContactFormProps,
} from "../../types/contact.types";

const INITIAL_FORM_DATA: ContactFormData = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
};

const DEFAULT_SUJETS = [
    { value: "information", label: "Demande d'information" },
    { value: "admission", label: "Admission" },
    { value: "partenariat", label: "Partenariat" },
    { value: "autre", label: "Autre" },
];

const iconSx = {
    fontSize: 20,
    color: GREEN[500],
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "0.9rem",
        backgroundColor: "#ffffff",
        "&.Mui-focused fieldset": {
            borderColor: GREEN[600],
        },
        "&:hover fieldset": {
            borderColor: GREEN[400],
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: GREEN[600],
    },
};

const selectSx = {
    borderRadius: "0.9rem",
    backgroundColor: "#ffffff",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: GREEN[600],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: GREEN[400],
    },
};

const ContactForm: React.FC<ContactFormProps> = (
    props: Readonly<ContactFormProps>,
) => {
    const { sujets = DEFAULT_SUJETS, onSubmit } = props;

    const [formData, setFormData] =
        useState<ContactFormData>(INITIAL_FORM_DATA);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setFormData((prev) => ({
            ...prev,
            sujet: event.target.value,
        }));
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(formData);
        }

        setSnackbar({
            open: true,
            message:
                "Message envoyé avec succès ! Nous vous répondrons sous 48h.",
            severity: "success",
        });

        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <>
            <Card
                elevation={0}
                sx={{
                    borderRadius: "1.25rem",
                    border: "1px solid #e5e7eb",
                    boxShadow: "none",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                }}
            >
                <div
                    className="h-2 w-full"
                    style={{
                        background: `linear-gradient(90deg, ${GREEN[500]}, ${GREEN[400]})`,
                    }}
                />

                <CardContent className="p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                            Envoyez-nous un message
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-gray-600">
                            Remplissez le formulaire ci-dessous et notre équipe
                            vous répondra dans les plus brefs délais.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1 — Informations */}
                        <div
                            className="rounded-2xl border border-gray-100 p-5 sm:p-6"
                            style={{ backgroundColor: "#fafafa" }}
                        >
                            <div className="mb-5 flex items-center gap-2">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: GREEN[50] }}
                                >
                                    <PersonRoundedIcon
                                        sx={{
                                            fontSize: 18,
                                            color: GREEN[600],
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Vos informations
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Indiquez vos coordonnées pour que nous
                                        puissions vous recontacter.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField
                                    label="Nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeRoundedIcon sx={iconSx} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    label="Prénom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonRoundedIcon
                                                    sx={iconSx}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailRoundedIcon
                                                    sx={iconSx}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    label="Téléphone"
                                    name="telephone"
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    sx={inputSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneRoundedIcon
                                                    sx={iconSx}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        <Divider />

                        {/* Section 2 — Demande */}
                        <div
                            className="rounded-2xl border border-gray-100 p-5 sm:p-6"
                            style={{ backgroundColor: "#fafafa" }}
                        >
                            <div className="mb-5 flex items-center gap-2">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: GREEN[50] }}
                                >
                                    <MessageRoundedIcon
                                        sx={{
                                            fontSize: 18,
                                            color: GREEN[600],
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Votre demande
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Précisez l&apos;objet de votre message
                                        et décrivez votre besoin.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <FormControl fullWidth size="small" required>
                                    <InputLabel
                                        id="sujet-label"
                                        sx={{
                                            "&.Mui-focused": {
                                                color: GREEN[600],
                                            },
                                        }}
                                    >
                                        Sujet
                                    </InputLabel>
                                    <Select
                                        labelId="sujet-label"
                                        label="Sujet"
                                        name="sujet"
                                        value={formData.sujet}
                                        onChange={handleSelectChange}
                                        sx={selectSx}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SubjectRoundedIcon
                                                    sx={iconSx}
                                                />
                                            </InputAdornment>
                                        }
                                    >
                                        {sujets.map((item) => (
                                            <MenuItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    multiline
                                    rows={7}
                                    size="small"
                                    placeholder="Décrivez votre demande avec le plus de précision possible..."
                                    sx={inputSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment
                                                position="start"
                                                sx={{
                                                    alignSelf: "flex-start",
                                                    mt: 1.5,
                                                }}
                                            >
                                                <MessageRoundedIcon
                                                    sx={iconSx}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        {/* Bouton */}
                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                endIcon={<SendRoundedIcon />}
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        sm: 240,
                                    },
                                    borderRadius: "0.9rem",
                                    px: 4,
                                    py: 1.4,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    backgroundColor: GREEN[600],
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: GREEN[700],
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Envoyer le message
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

export default ContactForm;