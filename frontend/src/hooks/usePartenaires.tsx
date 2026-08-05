import { useState, useEffect, useCallback } from 'react';
import partenaireService from '../services/partenaire.service';
import type { PartenaireItem } from '../types/partenaire.types';

/** Hook pour tous les partenaires */
export default function usePartenaires() {
  const [partenaires, setPartenaires] = useState<PartenaireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await partenaireService.findAll();
      setPartenaires(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { partenaires, loading, error, refetch: fetch };
}

/** Hook pour un partenaire par slug */
export function usePartenaireBySlug(slug: string) {
  const [partenaire, setPartenaire] = useState<PartenaireItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await partenaireService.findBySlug(slug);
        if (!cancelled) setPartenaire(data);
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

  return { partenaire, loading, error };
}
