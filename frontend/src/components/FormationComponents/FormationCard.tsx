import React from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { Link as RouterLink } from "react-router-dom";
import { GREEN } from "../../constants/colors";
import { getImageUrl } from "../../utils/image.utils";
import type { FormationCardProps } from "../../types/formations.types";

const FormationCard: React.FC<FormationCardProps> = (
    props: Readonly<FormationCardProps>,
) => {
    const {
        formation,
        detailLinkBase = "/formations",
        applyLink = "/admission",
    } = props;

    return (
        <Card
            sx={{
                borderRadius: "1rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <div className="flex flex-col sm:flex-row">
                {formation.image && (
                    <CardMedia
                        component="img"
                        image={getImageUrl(formation.image)}
                        alt={formation.titre}
                        sx={{
                            width: { xs: "100%", sm: "33.33%" },
                            height: { xs: "200px", sm: "auto" },
                            objectFit: "cover",
                            flexShrink: 0,
                        }}
                    />
                )}
                <CardContent className="p-0" sx={{ width: { xs: "100%", sm: "66.67%" } }}>

                <div className="p-6">
                    {/* En-tête */}
                    <div className="mb-4 flex items-start justify-between">
                        <Chip
                            label={formation.niveau}
                            variant="outlined"
                            size="small"
                            sx={{
                                color: GREEN[700],
                                borderColor: GREEN[200],
                                backgroundColor: GREEN[50],
                                fontWeight: 600,
                            }}
                        />

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
                            {formation.duree}
                        </div>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {formation.titre}
                    </h3>

                    <p
                        className="mb-4 text-sm font-medium"
                        style={{ color: GREEN[600] }}
                    >
                        {formation.domaine.join(", ")}
                    </p>

                    <p className="mb-6 leading-relaxed text-gray-600">
                        {formation.description}
                    </p>

                    <Divider className="mb-6" />

                    {/* Objectifs */}
                    <div className="mb-5">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <SchoolRoundedIcon
                                sx={{ fontSize: 18, color: GREEN[600] }}
                            />
                            Objectifs principaux
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {formation.objectifs.slice(0, 3).map((obj) => (
                                <li
                                    key={obj}
                                    className="flex items-start gap-2"
                                >
                                    <span
                                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                        style={{
                                            backgroundColor: GREEN[500],
                                        }}
                                    >
                                        ✓
                                    </span>
                                    <span>{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Débouchés */}
                    <div className="mb-6">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <WorkRoundedIcon
                                sx={{ fontSize: 18, color: GREEN[600] }}
                            />
                            Débouchés
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formation.debouches.slice(0, 3).map((debouche) => (
                                <Chip
                                    key={debouche}
                                    label={debouche}
                                    size="small"
                                    sx={{
                                        backgroundColor: GREEN[50],
                                        color: GREEN[800],
                                        fontWeight: 500,
                                        border: `1px solid ${GREEN[200]}`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            component={RouterLink}
                            to={`${detailLinkBase}/${formation.slug}`}
                            variant="contained"
                            fullWidth
                            endIcon={<ArrowForwardRoundedIcon />}
                            sx={{
                                borderRadius: "0.75rem",
                                py: 1.25,
                                textTransform: "none",
                                fontWeight: 600,
                                backgroundColor: GREEN[600],
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: GREEN[700],
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Voir le détail
                        </Button>

                        <Button
                            component={RouterLink}
                            to={applyLink}
                            variant="outlined"
                            fullWidth
                            sx={{
                                borderRadius: "0.75rem",
                                py: 1.25,
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
                            Postuler
                        </Button>
                    </div>
                </div>
            </CardContent>
            </div>
        </Card>
    );
};

export default FormationCard;