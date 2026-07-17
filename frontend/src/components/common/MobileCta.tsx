import React from "react";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

interface MobileCtaProps {
    label: string;
    link: string;
}

const MobileCta: React.FC<MobileCtaProps> = ({
    label,
    link,
}) => {
    return (
        <div className="mt-8 sm:hidden">
            <Button
                component={RouterLink}
                to={link}
                variant="outlined"
                fullWidth
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                    borderRadius: "0.75rem",
                    textTransform: "none",
                    fontWeight: 600,
                }}
            >
                {label}
            </Button>
        </div>
    );
};

export default MobileCta;