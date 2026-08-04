import { useState, useEffect, useCallback } from 'react';
import { formationService } from '../services';
import type { Formation, PaginationResponse } from '../types/formations.types';

// Hook pour toutes les formations avec pagination
export default function useFormations(page = 1, limit = 10) {
  const [data, setData] = useState<PaginationResponse<Formation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await formationService.findAll(page, limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Hook pour les formations en vedette (section homepage)
export function useFeaturedFormations(limit = 6) {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await formationService.findFeatured(limit);
        if (!cancelled) setFormations(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { formations, loading, error };
}

// Hook pour une formation par slug
export function useFormationBySlug(slug: string) {
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await formationService.findBySlug(slug);
        if (!cancelled) setFormation(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { formation, loading, error };
}
