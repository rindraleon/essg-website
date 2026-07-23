import React, { useEffect, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import partenaireService from "../../services/partenaire.service";
import { getImageUrl } from "../../utils/image.utils";
import type { PartenaireItem, PartenairesSectionProps } from "../../types";


const PartenairesSection: React.FC<PartenairesSectionProps> = (
    props: Readonly<PartenairesSectionProps>,
) => {
    const {
        title = "Nos Partenaires",
        description = "Des collaborations prestigieuses au niveau mondial",
        ctaLabel = "Voir tous nos partenaires",
        ctaLink = "/partenaires",
        maxItems = 8,
        partenaires: propPartenaires,
    } = props;

    const [partenaires, setPartenaires] = useState<PartenaireItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPartenaires = async () => {
            if (propPartenaires && propPartenaires.length > 0) {
                setPartenaires(propPartenaires);
                setLoading(false);
                return;
            }

            try {
                const data = await partenaireService.findAllPaginated(1, maxItems);
                setPartenaires(data);
            } catch (error) {
                console.error("Erreur lors du chargement des partenaires:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPartenaires();
    }, [propPartenaires, maxItems]);

    const visiblePartenaires = partenaires.slice(0, maxItems);

    const getLogoUrl = (partenaire: PartenaireItem): string | null => {
        if (!partenaire.logo) return null;
        return getImageUrl(partenaire.logo);
    };

    // Dupliquer les partenaires pour créer l'effet de défilement infini
    const duplicatedPartenaires = [...visiblePartenaires, ...visiblePartenaires, ...visiblePartenaires];

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="mb-3 text-4xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        {description}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden py-8">
                        <div className="flex animate-scroll">
                            {duplicatedPartenaires.map((partenaire, index) => {
                                const logoUrl = getLogoUrl(partenaire);
                                return (
                                    <div
                                        key={`${partenaire.id}-${index}`}
                                        className="flex-shrink-0 mx-8 w-32 h-32 flex items-center justify-center"
                                    >
                                        {logoUrl ? (
                                            <img
                                                src={logoUrl}
                                                alt={`${partenaire.nom} logo`}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                                <span className="text-xs text-gray-400 text-center px-2">
                                                    {partenaire.nom}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Button
                        component={RouterLink}
                        to={ctaLink}
                        variant="text"
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "1rem",
                            color: "#2563eb",
                            "&:hover": {
                                backgroundColor: "transparent",
                                color: "#1d4ed8",
                            },
                        }}
                    >
                        {ctaLabel}
                    </Button>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }

                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default PartenairesSection;
