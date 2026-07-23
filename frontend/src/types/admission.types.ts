import type { ReactNode } from "react";

export type AdmissionStep = {
    date: string;
    titre: string;
    icon: ReactNode;
};

export type AdmissionTimelineProps = {
    title?: string;
    steps?: AdmissionStep[];
};

export type AdmissionFormData = {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    dateNaissance: string;
    niveau: string;
    formation: string;
    diplomePrecedent: string;
    cv?: File;
    lettreMotivation?: File;
    accepteConditions: boolean;
};

export type AdmissionFormProps = {
    niveaux?: { value: string; label: string }[];
    formations?: { value: string; label: string }[];
    onSubmit?: (data: AdmissionFormData) => void;
};

export type AdmissionPageProps = {
    pageTitle?: string;
    pageSubtitle?: string;
    pageDescription?: string;
};

export type AdmissionCtaSectionProps = {
    title?: string;
    description?: string;
    primaryButtonLabel?: string;
    primaryButtonLink?: string;
    secondaryButtonLabel?: string;
    secondaryButtonLink?: string;
};
