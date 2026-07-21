import React from "react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { GREEN } from "../../constants/colors";
import ProjetMap from "./ProjetMap";
import { getImageUrl } from "../../utils/image.utils";
import type { ProjetDetailModalProps } from "../../types/projets.types";


const PROJECT_IMAGES: Record<string, string> = {
    "1": "1594935975218-a3596da034a3",
    "2": "1460186136353-977e9d6085a1",
    "3": "1602052577122-f73b9710adba",
    "4": "1451187580459-43490279c0fa",
    "5": "1531482615713-2afd69097998",
};

const getUnsplashUrl = (id: string): string => {
    const hash = PROJECT_IMAGES[id] ?? "1531482615713-2afd69097998";
    return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;
};

const getStatutColor = (statut: string): string => {
    if (statut === "En cours") {
        return GREEN[800];
    }
    return "#6b7280";
};

const ProjetDetailModal: React.FC<ProjetDetailModalProps> = (
    props: Readonly<ProjetDetailModalProps>,
) => {
    const { projet, open, onClose } = props;

    if (!projet) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "1rem",
                        overflow: "hidden",
                        maxHeight: "90vh",
                    },
                },
            }}
        >
            {/* Image hero */}
            <div className="relative aspect-video shrink-0 bg-gradient-to-br from-green-600 to-green-900">
                <img
                    src={projet.image ? getImageUrl(projet.image) : getUnsplashUrl(projet.id)}
                    alt={projet.titre}
                    className="h-full w-full object-cover opacity-75"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                    <Chip
                        label={projet.type}
                        size="small"
                        sx={{
                            backgroundColor: "rgba(255,255,255,0.92)",
                            color: "#111827",
                            fontWeight: 600,
                        }}
                    />

                    <div className="flex items-center gap-2">
                        <Chip
                            label={projet.statut}
                            size="small"
                            sx={{
                                backgroundColor: getStatutColor(projet.statut),
                                color: "#ffffff",
                                fontWeight: 600,
                            }}
                        />

                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{
                                backgroundColor: "rgba(0,0,0,0.4)",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                },
                            }}
                        >
                            <CloseRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-white drop-shadow sm:text-2xl">
                        {projet.titre}
                    </p>
                </div>
            </div>

            <DialogContent className="p-6">
                <div className="space-y-6">
                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <CalendarTodayRoundedIcon
                                sx={{ fontSize: 16, color: GREEN[600] }}
                            />
                            <span>{projet.annee}</span>
                        </div>

                        {projet.budget && (
                            <div className="flex items-center gap-1.5">
                                <AccountBalanceWalletRoundedIcon
                                    sx={{ fontSize: 16, color: GREEN[600] }}
                                />
                                <span>{projet.budget}</span>
                            </div>
                        )}

                        {projet.location && (
                            <div className="flex items-center gap-1.5">
                                <RoomRoundedIcon
                                    sx={{ fontSize: 16, color: "#f43f5e" }}
                                />
                                <span>
                                    {projet.location.ville},{" "}
                                    {projet.location.pays}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-900">
                            Description
                        </h3>
                        <p className="leading-relaxed text-gray-700">
                            {projet.description}
                        </p>
                    </div>

                    {/* Objectifs */}
                    {projet.objectifs && projet.objectifs.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
                                Objectifs
                            </h3>
                            <ul className="space-y-2">
                                {projet.objectifs.map((obj) => (
                                    <li
                                        key={obj}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                        <CheckCircleRoundedIcon
                                            sx={{
                                                fontSize: 18,
                                                color: GREEN[500],
                                                mt: 0.25,
                                                flexShrink: 0,
                                            }}
                                        />
                                        {obj}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Partenaires */}
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-900">
                            <GroupsRoundedIcon
                                sx={{ fontSize: 18, color: GREEN[600] }}
                            />
                            Partenaires
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {projet.partenaires.map((partenaire) => (
                                <Chip
                                    key={partenaire}
                                    label={partenaire}
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

                    {/* Carte */}
                    {(projet.location || (projet as any).latitude || (projet as any).longitude) && (
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
                                Localisation du projet
                            </h3>
                            <ProjetMap
                                location={projet.location}
                                latitude={(projet as any).latitude}
                                longitude={(projet as any).longitude}
                                label={projet.location ? `${projet.location.ville}, ${projet.location.pays}` : undefined}
                                height="300px"
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjetDetailModal;