import React, { useState } from "react";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { GREEN } from "../../constants/colors";
import { getImageUrl } from "../../utils/image.utils";
import type { PartenaireCardProps } from "../../types/partenaire.types";

const renderTypeIcon = (type: string) => {
    const sx = { fontSize: 40, color: GREEN[600] };

    switch (type) {
        case "Entreprise":
            return <ApartmentRoundedIcon sx={sx} />;
        case "Institution":
            return <PublicRoundedIcon sx={sx} />;
        case "Organisation":
            return <SchoolRoundedIcon sx={sx} />;
        default:
            return <PublicRoundedIcon sx={sx} />;
    }
};

const PartenaireCard: React.FC<PartenaireCardProps> = (
    props: Readonly<PartenaireCardProps>,
) => {
    const { partenaire } = props;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const logoUrl = partenaire.logo ? getImageUrl(partenaire.logo) : null;

    return (
        <Card
            sx={{
                borderRadius: "1.25rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.3s ease",
                height: "100%",
                "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
            }}
        >
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div
                    className="mb-5 flex h-20 w-20 items-center justify-center rounded-md overflow-hidden flex-shrink-0"
                    style={{ 
                        backgroundColor: GREEN[50],
                        border: `2px solid ${GREEN[100]}`
                    }}
                >
                    {logoUrl && !imageError ? (
                        <>
                            {!imageLoaded && (
                                <CircularProgress size={28} sx={{ color: GREEN[600] }} />
                            )}
                            <img
                                src={logoUrl}
                                alt={`${partenaire.nom} logo`}
                                className={`h-full w-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoaded(false);
                                }}
                                style={{
                                    position: imageLoaded ? 'relative' : 'absolute',
                                    transition: 'opacity 0.3s ease',
                                }}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center">
                            {renderTypeIcon(partenaire.type)}
                        </div>
                    )}
                </div>

                <div className="flex-grow flex flex-col justify-between w-full">
                    <div>
                        <h3 className="mb-3 font-bold text-gray-900 text-base leading-tight">
                            {partenaire.nom}
                        </h3>

                        <Chip
                            label={partenaire.type}
                            variant="outlined"
                            size="small"
                            sx={{
                                mb: 2,
                                color: GREEN[700],
                                borderColor: GREEN[200],
                                backgroundColor: GREEN[50],
                                fontWeight: 500,
                                fontSize: "0.75rem",
                            }}
                        />
                    </div>

                    {partenaire.secteur && (
                        <div className="text-sm text-gray-600 mt-auto pt-2">
                            {partenaire.secteur}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PartenaireCard;
