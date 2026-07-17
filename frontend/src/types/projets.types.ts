export type ProjetLocation = {
    ville: string;
    pays: string;
    adresse?: string;
    lat: number;
    lng: number;
};

export type ProjetItem = {
    id: string;
    titre: string;
    type: string;
    statut: string;
    annee: string;
    description: string;
    budget?: string;
    partenaires: string[];
    objectifs?: string[];
    image?: string;
    location?: ProjetLocation;
};

export type ProjetCardProps = {
    projet: ProjetItem;
    onViewDetail: (projet: ProjetItem) => void;
};

export type ProjetDetailModalProps = {
    projet: ProjetItem | null;
    open: boolean;
    onClose: () => void;
};

export type MapEmbedProps = {
    lat: number;
    lng: number;
    label: string;
    adresse?: string;
    zoom?: "close" | "city" | "region";
};

export type ProjetsPageProps = {
    pageTitle?: string;
    pageSubtitle?: string;
    pageDescription?: string;
    projets?: ProjetItem[];
};