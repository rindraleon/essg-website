import { useState, useEffect, useCallback } from 'react';
import { projetService } from '../services';
import type { ProjetItem } from '../types/projets.types';

// Hook pour tous les projets
export default function useProjets() {
  const [projets, setProjets] = useState<ProjetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projetService.findAll();
      setProjets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { projets, loading, error, refetch: fetch };
}

// Hook pour un projet par ID (legacy, conservé pour compatibilité)
export function useProjetById(id: string) {
  const [projet, setProjet] = useState<ProjetItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projetService.findOne(Number(id));
        if (!cancelled) setProjet(data);
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
  }, [id]);

  return { projet, loading, error };
}

// Hook pour un projet par slug
export function useProjetBySlug(slug: string) {
  const [projet, setProjet] = useState<ProjetItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projetService.findBySlug(slug);
        if (!cancelled) setProjet(data);
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

  return { projet, loading, error };
}
