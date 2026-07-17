import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { getImageUrl } from "../../utils/image.utils";
import { type Actualite } from "../../types/news.types";

interface NewsCardProps {
  actualite: Actualite;
  onView?: (id: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ actualite, onView }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <Box
            sx={{
              fontSize: "2.5rem",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.light",
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            {actualite.image ? (
              <img
                src={getImageUrl(actualite.image)}
                alt={actualite.titre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>📰</span>
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
              {actualite.titre}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              <Chip
                label={actualite.categorie}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(actualite.date)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {actualite.resume || actualite.contenu}
        </Typography>
      </CardContent>
      {onView && (
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onView(actualite.id)}
            aria-label="voir"
          >
            <Visibility />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default NewsCard;