import React, { useEffect, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";


import { getImageUrl } from "../../utils/image.utils";
import {
    SectionHeader,
    SectionContent,
    ScrollableCardGrid,
    MobileCta,
} from "../../components";
import { formationService } from "../../services";
import type { FeaturedFormationsSectionProps, Formation } from "../../types";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1523050854058-8df90110a6f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800";

const FormationsSection: React.FC<FeaturedFormationsSectionProps> = ({
    title = "Formations d'excellence",
    description = "Des programmes d'excellence reconnus internationalement",
    ctaLabel = "Voir toutes les formations",
    ctaLink = "/formations",
    featuredFormations: propFeaturedFormations,
}) => {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchFeaturedFormations = async () => {
            if (propFeaturedFormations !== undefined) {
                if (isMounted) {
                    setFormations(propFeaturedFormations);
                    setLoading(false);
                    setError(null);
                }
                return;
            }

            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }

                const data = await formationService.findFeatured();

                if (isMounted) {
                    setFormations(data as Formation[]);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des formations :", err);

                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Erreur lors du chargement des formations",
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchFeaturedFormations();

        return () => {
            isMounted = false;
        };
    }, [propFeaturedFormations]);

    const headerContent = (
        <SectionHeader
            title={title}
            description={description}
            ctaLabel={ctaLabel}
            ctaLink={ctaLink}
        />
    );

    // 1 card mobile, 2 tablette, 3 desktop
    const cardWidthClass =
        "flex-none w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)] snap-start";
    
    const skeletonKeys = ['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4'];

    const loadingSkeletons = (
        <ScrollableCardGrid className="mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={skeletonKeys[i]}
                    className={`${cardWidthClass} rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm`}
                >
                    <div className="aspect-[16/10] w-full bg-gray-200 animate-pulse" />
                    <div className="p-6 space-y-4">
                        <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-5 w-4/5 rounded bg-gray-200 animate-pulse" />
                        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                        <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                    </div>
                </div>
            ))}
        </ScrollableCardGrid>
    );

    return (
        <SectionContent
            loading={loading}
            error={error}
            isEmpty={!loading && formations.length === 0}
            emptyMessage="Aucune formation disponible pour le moment."
            headerContent={headerContent}
            loadingSkeletons={loadingSkeletons}
            sectionClassName="py-16 bg-white"
            fluid
            containerClassName="max-w-none"
        >
            <ScrollableCardGrid className="mt-2 w-full">
                {formations.map((formation) => {
                    const imageUrl = formation.image
                        ? getImageUrl(formation.image)
                        : FALLBACK_IMAGE;

                    const formationLink = `/formations/${formation.slug ?? formation.id}`;

                    return (
                        <article
                            key={formation.id}
                            className={`${cardWidthClass} group rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-sm transition-all duration-300 flex flex-col`}
                        >
                            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                <img
                                    src={imageUrl}
                                    alt={formation.titre}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="mb-4">
                                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {formation.niveau || "Formation"}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                                    {formation.titre}
                                </h3>

                                <p className="text-sm text-justify text-gray-600 line-clamp-3 flex-1 leading-6">
                                    {formation.description || "Découvrez cette formation d'excellence."}
                                </p>

                                <Button
                                    component={RouterLink}
                                    to={formationLink}
                                    variant="text"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    aria-label={`En savoir plus sur ${formation.titre}`}
                                    sx={{
                                        mt: 3,
                                        p: 0,
                                        minWidth: "auto",
                                        color: "#2563eb",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        justifyContent: "flex-start",
                                        alignSelf: "flex-start",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                            color: "#1d4ed8",
                                        },
                                    }}
                                >
                                    En savoir plus
                                </Button>
                            </div>
                        </article>
                    );
                })}
            </ScrollableCardGrid>

            <MobileCta label={ctaLabel} link={ctaLink} />
        </SectionContent>
    );
};

export default FormationsSection;