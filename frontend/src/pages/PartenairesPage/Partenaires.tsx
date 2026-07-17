import React, { useState, useMemo, useEffect } from "react";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import CtaSection from "../../components/common/CtaSection";
import EmptyState from "../../components/common/EmptyState";
import FilterToolbar from "../../components/common/FilterToolbar";
import PageHero from "../../components/common/PageHero";
import PartenaireCard from "../../components/PartenaireComponents/PartenaireCard";

import { GREEN } from "../../constants/colors";
import { partenaireService } from "../../services";
import type { PartenairesPageProps, PartenaireItem } from "../../types/partenaire.types";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

const TYPES = [
    { value: "all", label: "Tous les types" },
    { value: "Entreprise", label: "Entreprise" },
    { value: "Institution", label: "Institution" },
    { value: "Organisation", label: "Organisation" },
    { value: "Autre", label: "Autre" },
];

const PartenairesPage: React.FC<PartenairesPageProps> = (
    props: Readonly<PartenairesPageProps>,
) => {
    const {
        pageTitle = "Nos Partenaires",
        pageSubtitle = "ESSG — Réseau & Coopération",
        pageDescription = "Des collaborations prestigieuses au niveau national et international pour une excellence partagée.",
    } = props;

    const [allPartenaires, setAllPartenaires] = useState<PartenaireItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const loadPartenaires = async () => {
            try {
                setLoading(true);
                const data = await partenaireService.findAllPaginated(1, 100);
                
                // Transformer les données du backend vers le format PartenaireItem
                const transformedPartenaires: PartenaireItem[] = data.map((partenaire: any) => ({
                    id: partenaire.id,
                    nom: partenaire.nom,
                    type: partenaire.type,
                    secteur: partenaire.secteur,
                    description: partenaire.description,
                    siteWeb: partenaire.siteWeb,
                    logo: partenaire.logo,
                    contact: partenaire.contact,
                    dateDebut: partenaire.dateDebut,
                    creeLe: partenaire.creeLe,
                    misAJourLe: partenaire.misAJourLe,
                }));
                
                setAllPartenaires(transformedPartenaires);
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement des partenaires:', err);
                setError('Impossible de charger les partenaires');
            } finally {
                setLoading(false);
            }
        };

        loadPartenaires();
    }, []);

    const hasActiveFilters = typeFilter !== "all";
    const activeFilterCount = hasActiveFilters ? 1 : 0;

    const filteredPartenaires = useMemo(
        () =>
            allPartenaires.filter((partenaire) =>
                typeFilter === "all" || partenaire.type === typeFilter,
            ),
        [allPartenaires, typeFilter],
    );

    const resultCount = filteredPartenaires.length;
    const resultText = `${resultCount} partenaire${resultCount > 1 ? "s" : ""} trouvé${resultCount > 1 ? "s" : ""}`;

    const handleTypeChange = (event: SelectChangeEvent) => {
        setTypeFilter(event.target.value);
    };

    const handleResetFilters = () => {
        setTypeFilter("all");
        setShowFilters(false);
    };

    const activeFilterChips = hasActiveFilters
        ? [
              {
                  key: "type",
                  label: `Type: ${typeFilter}`,
                  onDelete: () => setTypeFilter("all"),
              },
          ]
        : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHero
                image={HERO_IMAGE}
                imageAlt="Partenaires ESSG"
                badgeIcon={<HandshakeRoundedIcon />}
                badgeLabel={pageSubtitle}
                title={pageTitle}
                description={pageDescription}
                stats={[
                    { value: `${allPartenaires.length}+`, label: "Partenaires" },
                    { value: "30+", label: "Pays" },
                    { value: "100+", label: "Projets communs" },
                ]}
            />

            <FilterToolbar
                resultText={resultText}
                showFilters={showFilters}
                activeFilterCount={activeFilterCount}
                hasActiveFilters={hasActiveFilters}
                onToggleFilters={() => setShowFilters((prev) => !prev)}
                onResetFilters={handleResetFilters}
                activeFilterChips={activeFilterChips}
            >
                <div className="max-w-xs">
                    <FormControl fullWidth size="small">
                        <InputLabel
                            id="type-label"
                            sx={{ "&.Mui-focused": { color: GREEN[600] } }}
                        >
                            Type de partenaire
                        </InputLabel>
                        <Select
                            labelId="type-label"
                            label="Type de partenaire"
                            value={typeFilter}
                            onChange={handleTypeChange}
                            sx={{
                                borderRadius: "0.75rem",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: GREEN[600],
                                    },
                            }}
                        >
                            {TYPES.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </FilterToolbar>

            {loading && (
                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-gray-500">Chargement des partenaires...</p>
                        </div>
                    </div>
                </section>
            )}

            {error && (
                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-red-500">{error}</p>
                        </div>
                    </div>
                </section>
            )}

            {!loading && !error && (
                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {resultCount === 0 ? (
                            <EmptyState
                                icon={
                                    <HandshakeRoundedIcon
                                        sx={{ fontSize: 40, color: GREEN[400] }}
                                    />
                                }
                                title="Aucun partenaire trouvé"
                                description="Essayez de modifier vos critères de filtrage."
                                onAction={handleResetFilters}
                            />
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredPartenaires.map((partenaire) => (
                                    <PartenaireCard
                                        key={partenaire.id}
                                        partenaire={partenaire}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            <CtaSection
                icon={
                    <HandshakeRoundedIcon
                        sx={{ fontSize: 48, color: GREEN[400] }}
                    />
                }
                title="Devenir partenaire de l'ESSG"
                description="Rejoignez notre réseau de partenaires prestigieux et contribuez à former les talents de demain."
                primaryLabel="Contactez-nous"
                primaryLink="partenariats@essg.mg"
                primaryIsMailto
            />
        </div>
    );
};

export default PartenairesPage;