import React from "react";
import Chip from "@mui/material/Chip";
import type { SxProps } from "@mui/material";

interface CategoryChipProps {
  category: string;
  size?: "small" | "medium";
  sx?: SxProps;
}

const categoryColors: Record<string, { backgroundColor: string; color: string }> = {
  "Événement": { backgroundColor: "#f0fdf4", color: "#16a34a" },
  "Partenariat": { backgroundColor: "#fef3c7", color: "#d97706" },
  "Recherche": { backgroundColor: "#dbeafe", color: "#2563eb" },
  "Vie Étudiante": { backgroundColor: "#fce7f3", color: "#db2777" },
};

const CategoryChip: React.FC<CategoryChipProps> = ({ category, size = "small", sx }) => {
  const colors = categoryColors[category] || { backgroundColor: "#ede9fe", color: "#7c3aed" };

  return (
    <Chip
      label={category}
      size={size}
      sx={{
        backgroundColor: colors.backgroundColor,
        color: colors.color,
        fontWeight: 600,
        fontSize: size === "small" ? "0.7rem" : "0.8rem",
        ...sx,
      }}
    />
  );
};

export default CategoryChip;
