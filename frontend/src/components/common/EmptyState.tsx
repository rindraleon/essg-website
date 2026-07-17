import React from "react";
import Button from "@mui/material/Button";
import { GREEN } from "../../constants/colors";
import type { EmptyStateProps } from "../../types/common.types";

const EmptyState: React.FC<EmptyStateProps> = (
    props: Readonly<EmptyStateProps>,
) => {
    const {
        icon,
        title = "Aucun résultat trouvé",
        description = "Essayez de modifier vos critères de recherche.",
        actionLabel = "Réinitialiser les filtres",
        onAction,
    } = props;

    return (
        <div className="py-20 text-center">
            <div
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: GREEN[50] }}
            >
                {icon}
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {title}
            </h3>

            <p className="mx-auto mb-6 max-w-md text-gray-500">
                {description}
            </p>

            {onAction && (
                <Button
                    variant="outlined"
                    onClick={onAction}
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
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;