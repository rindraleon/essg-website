export type PartenaireItem = {
    id: number | string;
    nom: string;
    type: 'Entreprise' | 'Institution' | 'Organisation' | 'Autre' | string;
    pays?: string;
    secteur?: string;
    description?: string;
    siteWeb?: string;
    logo?: string;
    contact?: string;
    dateDebut?: string;
    creeLe?: string;
    misAJourLe?: string;
};

export type PartenaireCardProps = {
    partenaire: PartenaireItem;
};

export type PartenairesPageProps = {
    pageTitle?: string;
    pageSubtitle?: string;
    pageDescription?: string;
    partenaires?: PartenaireItem[];
};