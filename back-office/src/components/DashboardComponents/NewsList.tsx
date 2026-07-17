import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import NewsCard from "./NewsCard";
import {  type Actualite } from "../../types/news.types";
import { getNews } from "../../services/news.service";

const NewsList: React.FC = () => {
  const [news, setNews] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNews();
      setNews(data);
    } catch (err) {
      setError("Erreur lors du chargement des actualités");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchNews}
        >
          Réessayer
        </Button>
      </Box>
    );
  }

  if (news.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Aucune actualité disponible pour le moment
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {news.map((actualite) => (
        <Grid size={{ xs: 12, md: 6 }} key={actualite.id}>
          <NewsCard actualite={actualite} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NewsList;