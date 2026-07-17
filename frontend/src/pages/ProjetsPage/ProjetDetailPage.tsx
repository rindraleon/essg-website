import React, { useEffect } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { Link as RouterLink, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CtaSection, EmptyState, PageHero } from "../../components";
import { GREEN } from "../../constants/colors";
import { useProjetById } from "../../hooks/useProjets";
import { useTitle } from "../../hooks/useTitle";
import { getImageUrl } from "../../utils/image.utils";

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const getProjetImage = (image: string | undefined, slug: string): string => {
  if (image) {
    return getImageUrl(image);
  }
  // Images par défaut selon le slug
  const defaultImages: Record<string, string> = {
    'international': '1453732638553-7c9b5c6c5c0a',
    'service-public': '1586773867938-d2e2e7e7e7e7',
    'recherche': '1532094348800-1c5e8e7e7e7e7',
    'innovation': '1518770660439-4636190af475',
  };
  
  const hash = defaultImages[slug] || "1451187580459-43490279c0fa";
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

const ProjetDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { projet, loading, error } = useProjetById(slug || "");
    const { setTitle } = useTitle();

    useEffect(() => {
        if (projet) {
            setTitle(projet.titre);
        }
    }, [projet, setTitle]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                        <p className="text-gray-500">Chargement du projet...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !projet) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <EmptyState
                        icon={
                            <RocketLaunchRoundedIcon
                                sx={{ fontSize: 40, color: GREEN[400] }}
                            />
                        }
                        title="Projet introuvable"
                        description="Le projet que vous recherchez n'existe pas ou a été supprimé."
                        actionLabel="Retour aux projets"
                        onAction={() => window.history.back()}
                    />

                    <div className="mt-8 text-center">
                        <Button
                            component={RouterLink}
                            to="/projets"
                            variant="outlined"
                            startIcon={<ArrowBackRoundedIcon />}
                            sx={{
                                borderRadius: "0.75rem",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: GREEN[600],
                                color: GREEN[600],
                                "&:hover": {
                                    borderColor: GREEN[700],
                                    backgroundColor: GREEN[50],
                                },
                            }}
                        >
                            Tous les projets
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = getProjetImage(projet.image, projet.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHero
                image={imageUrl}
                imageAlt={projet.titre}
                badgeIcon={<RocketLaunchRoundedIcon />}
                badgeLabel={projet.type}
                title={projet.titre}
                description={projet.description}
                minHeight="50vh"
            />

            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
                    <Button
                        component={RouterLink}
                        to="/"
                        variant="text"
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            color: "gray.600",
                            fontSize: "0.875rem",
                            "&:hover": {
                                backgroundColor: GREEN[50],
                                color: GREEN[600],
                            },
                        }}
                    >
                        Accueil
                    </Button>

                    <span className="text-gray-400">›</span>

                    <Button
                        component={RouterLink}
                        to="/projets"
                        variant="text"
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            color: "gray.600",
                            fontSize: "0.875rem",
                            "&:hover": {
                                backgroundColor: GREEN[50],
                                color: GREEN[600],
                            },
                        }}
                    >
                        Projets
                    </Button>

                    <span className="text-gray-400">›</span>

                    <span className="truncate text-sm font-medium text-gray-900">
                        {projet.titre}
                    </span>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Article principal */}
                    <div className="lg:col-span-2">
                        <Card
                            sx={{
                                borderRadius: "1rem",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <CardContent className="p-6 sm:p-8">
                                {/* Meta informations */}
                                <div className="mb-6 flex flex-wrap items-center gap-4">
                                    <span
                                        className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                        style={{
                                            color: "#2563eb",
                                            backgroundColor: "#eff6ff",
                                            border: "1px solid #bfdbfe",
                                        }}
                                    >
                                        {projet.type}
                                    </span>

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <CalendarTodayRoundedIcon
                                            sx={{ fontSize: 14 }}
                                        />
                                        {projet.annee}
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <span className="font-medium">Statut:</span>
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{
                                                color: projet.statut === "Terminé" ? "#059669" : "#d97706",
                                                backgroundColor: projet.statut === "Terminé" ? "#d1fae5" : "#fef3c7",
                                            }}
                                        >
                                            {projet.statut}
                                        </span>
                                    </div>
                                </div>

                                <Divider className="mb-6" />

                                {/* Description */}
                                <div className="prose max-w-none text-gray-700">
                                    <p className="mb-4 text-lg font-medium leading-relaxed">
                                        {projet.description}
                                    </p>
                                </div>

                                {/* Objectifs */}
                                {projet.objectifs && projet.objectifs.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Objectifs du projet
                                        </h3>
                                        <ul className="space-y-2">
                                        {projet.objectifs.map((objectif: string, index: number) => (
                                            <li
                                                key={objectif + index}
                                                className="flex items-start gap-2 text-gray-700"
                                            >
                                                <span
                                                    className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: GREEN[600] }}
                                                />
                                                <span>{objectif}</span>
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Partenaires */}
                                {projet.partenaires && projet.partenaires.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Partenaires
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {projet.partenaires.map((partenaire: string, index: number) => (
                                                <span
                                                    key={partenaire +  index}
                                                    className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                                >
                                                    {partenaire}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Informations du projet */}
                        <Card
                            sx={{
                                borderRadius: "1rem",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
                                    Informations
                                </h3>
                                <div className="space-y-4">
                                    {projet.budget && (
                                        <div className="flex items-start gap-3">
                                            <AttachMoneyRoundedIcon
                                                sx={{ color: GREEN[600], fontSize: 20 }}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Budget
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {projet.budget}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {projet.location && (
                                        <div className="flex items-start gap-3">
                                            <LocationOnRoundedIcon
                                                sx={{ color: GREEN[600], fontSize: 20 }}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Localisation
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {projet.location.ville}, {projet.location.pays}
                                                </div>
                                                {projet.location.adresse && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {projet.location.adresse}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <PeopleRoundedIcon
                                            sx={{ color: GREEN[600], fontSize: 20 }}
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                Partenaires
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {projet.partenaires.length} partenaire
                                                {projet.partenaires.length > 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Carte de localisation */}
                        {projet.location && projet.location.lat && projet.location.lng && (
                            <Card
                                sx={{
                                    borderRadius: "1rem",
                                    border: "1px solid #e5e7eb",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent className="p-0">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                                            Localisation sur la carte
                                        </h3>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <MapContainer
                                            center={[projet.location.lat, projet.location.lng]}
                                            zoom={13}
                                            scrollWheelZoom={false}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[projet.location.lat, projet.location.lng]}>
                                                <Popup>
                                                    <div className="text-sm">
                                                        <div className="font-semibold text-gray-900 mb-1">
                                                            {projet.titre}
                                                        </div>
                                                        {projet.location.adresse && (
                                                            <div className="text-gray-600">
                                                                {projet.location.adresse}
                                                            </div>
                                                        )}
                                                        <div className="text-gray-500 mt-1">
                                                            {projet.location.ville}, {projet.location.pays}
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Bouton retour */}
                        <Button
                            component={RouterLink}
                            to="/projets"
                            variant="outlined"
                            fullWidth
                            startIcon={<ArrowBackRoundedIcon />}
                            sx={{
                                borderRadius: "0.75rem",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: GREEN[600],
                                color: GREEN[600],
                                "&:hover": {
                                    borderColor: GREEN[700],
                                    backgroundColor: GREEN[50],
                                },
                            }}
                        >
                            Tous les projets
                        </Button>
                    </div>
                </div>
            </div>

            <CtaSection
                icon={
                    <RocketLaunchRoundedIcon
                        sx={{ fontSize: 48, color: GREEN[400] }}
                    />
                }
                title="Vous avez un projet de recherche ?"
                description="Collaborez avec l'ESSG pour vos projets de recherche, d'innovation ou de développement en sciences géomatiques."
                primaryLabel="Nous contacter"
                primaryLink="/contact"
                secondaryLabel="Voir nos formations"
                secondaryLink="/formations"
            />
        </div>
    );
};

export default ProjetDetailPage;