import React from "react";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

interface SectionHeaderProps {
    title: string;
    description: string;
    ctaLabel?: string;
    ctaLink?: string;
    showCta?: boolean;
    center?: boolean;
    maxWidth?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    description,
    ctaLabel,
    ctaLink,
    showCta = true,
    center = true,
    maxWidth = "max-w-2xl",
}) => {
    return (
        <div className={`mb-10 flex flex-col ${center ? "items-center text-center" : "items-start"}`}>
            <div className={center ? `text-center` : ""}>
                <h2 className="text-3xl font-bold text-gray-900">
                    {title}
                </h2>
                <p className={`mt-2 text-gray-500 ${center ? maxWidth : "max-w-2xl"}`}>
                    {description}
                </p>
            </div>
            {showCta && ctaLabel && ctaLink && (
                <Button  
                    component={RouterLink}
                    to={ctaLink}
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                        display: { xs: "none", sm: "inline-flex" },
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        fontWeight: 600,
                        mt: 2,
                    }}
                >
                    {ctaLabel}
                </Button>
            )}
        </div>
    );
};

export default SectionHeader;