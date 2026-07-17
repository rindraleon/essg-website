import React, { useEffect } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Link as RouterLink, useParams } from "react-router-dom";
import { CtaSection, EmptyState, PageHero, CategoryChip } from "../../components";
import { GREEN } from "../../constants/colors";
import { formatDate } from "../../utils/date.utils";
import { useActualiteBySlug } from "../../hooks";
import { useTitle } from "../../hooks/useTitle";

const ACTUALITE_IMAGES: Record<string, string> = {
    "1": "1602052577122-f73b9710adba",
    "2": "1460186136353-977e9d6085a1",
    "3": "1768117173988-5ebfdde4fdd3",
    "4": "1773828755374-0ee802d9f44b",
    "5": "1590012314607-cda9d9b699ae",
};

const getActualiteImage = (id: string): string => {
    const hash = ACTUALITE_IMAGES[id] ?? "1594935975218-a3596da034a3";
    return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

const ActualiteDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { actualite, loading, error } = useActualiteBySlug(slug || "");
    const { setTitle } = useTitle();

    useEffect(() => {
        if (actualite) {
            setTitle(actualite.titre);
        }
    }, [actualite, setTitle]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: actualite?.titre,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                        <p className="text-gray-500">Chargement de l'article...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !actualite) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <EmptyState
                        icon={
                            <NewspaperRoundedIcon
                                sx={{ fontSize: 40, color: GREEN[400] }}
                            />
                        }
                        title="Article introuvable"
                        description="L'article que vous recherchez n'existe pas ou a été supprimé."
                        actionLabel="Retour aux actualités"
                        onAction={() => window.history.back()}
                    />

                    <div className="mt-8 text-center">
                        <Button
                            component={RouterLink}
                            to="/actualites"
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
                            Toutes les actualités
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHero
                image={getActualiteImage(actualite.id.toString())}
                imageAlt={actualite.titre}
                badgeIcon={<NewspaperRoundedIcon />}
                badgeLabel={actualite.categorie}
                title={actualite.titre}
                minHeight="50vh"
            />

            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Button
                        component={RouterLink}
                        to="/actualites"
                        variant="text"
                        startIcon={<ArrowBackRoundedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: GREEN[600],
                            "&:hover": {
                                backgroundColor: GREEN[50],
                            },
                        }}
                    >
                        Toutes les actualités
                    </Button>

                    <span className="text-sm text-gray-400">/</span>

                    <span className="truncate text-sm font-medium text-gray-700">
                        {actualite.titre}
                    </span>
                </div>
            </div>

            {/* Contenu */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Article */}
                    <div className="lg:col-span-2">
                        <Card
                            sx={{
                                borderRadius: "1rem",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <CardContent className="p-6 sm:p-8">
                                {/* Meta */}
                                <div className="mb-6 flex flex-wrap items-center gap-4">
                                    <CategoryChip 
                                        category={actualite.categorie} 
                                        size="small"
                                        sx={{
                                            backgroundColor: GREEN[50],
                                            color: GREEN[800],
                                            border: `1px solid ${GREEN[200]}`,
                                        }}
                                    />

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <CalendarTodayRoundedIcon
                                            sx={{ fontSize: 14 }}
                                        />
                                        {formatDate(actualite.date)}
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <PersonRoundedIcon
                                            sx={{ fontSize: 14 }}
                                        />
                                        {actualite.auteur}
                                    </div>

                                    <Tooltip title="Partager">
                                        <IconButton
                                            size="small"
                                            onClick={handleShare}
                                            sx={{
                                                ml: "auto",
                                                color: GREEN[600],
                                            }}
                                        >
                                            <ShareRoundedIcon
                                                sx={{ fontSize: 20 }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </div>

                                <Divider className="mb-6" />

                                {/* Contenu de l'article */}
                                <div className="prose max-w-none text-gray-700">
                                    <p className="mb-4 text-lg font-medium leading-relaxed">
                                        {actualite.resume}
                                    </p>

                                    {actualite.contenu ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: actualite.contenu,
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <p className="mb-4 leading-relaxed">
                                                {actualite.contenu}
                                            </p>
                                            <p className="leading-relaxed">
                                                Pour plus d'informations,
                                                n'hésitez pas à nous
                                                contacter ou à consulter nos
                                                autres actualités.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Infos auteur */}
                        <Card
                            sx={{
                                borderRadius: "1rem",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
                                    Auteur
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: GREEN[50],
                                        }}
                                    >
                                        <PersonRoundedIcon
                                            sx={{ color: GREEN[600] }}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {actualite.auteur}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            ESSG
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bouton retour */}
                        <Button
                            component={RouterLink}
                            to="/actualites"
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
                            Toutes les actualités
                        </Button>
                    </div>
                </div>
            </div>

            <CtaSection
                icon={
                    <NewspaperRoundedIcon
                        sx={{ fontSize: 48, color: GREEN[400] }}
                    />
                }
                title="Ne manquez aucune actualité"
                description="Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles de l'ESSG directement dans votre boîte mail."
                primaryLabel="S'abonner"
                primaryLink="/contact"
                secondaryLabel="Voir les formations"
                secondaryLink="/formations"
            />
        </div>
    );
};

export default ActualiteDetailPage;