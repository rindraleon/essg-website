import { useState, useEffect, useCallback, useRef } from 'react';
import { actualiteService } from '../services';
import type { Actualite } from '../types/actualite.types';
import type { PaginationResponse } from '../types/formations.types';

// Cache simple pour éviter les requêtes répétées
const paginationCache = new Map<
  string,
  { data: PaginationResponse<Actualite>; timestamp: number }
>();
const recentCache = new Map<string, { data: Actualite[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Hook pour toutes les actualités avec pagination
export default function useActualites(page = 1, limit = 10) {
  const [data, setData] = useState<PaginationResponse<Actualite> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Vérifier le cache
    const cacheKey = `actualites-${page}-${limit}`;
    const cached = paginationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await actualiteService.findAll(page, limit, controller.signal);
      setData(result);

      // Mettre en cache
      paginationCache.set(cacheKey, { data: result, timestamp: Date.now() });
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [page, limit]);

  useEffect(() => {
    fetch();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Hook pour les actualités récentes (section homepage)
export function useRecentActualites(limit = 6) {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Annuler la requête précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Vérifier le cache
    const cacheKey = `recent-${limit}`;
    const cached = recentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setActualites(cached.data);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await actualiteService.findRecent(limit, controller.signal);
        if (!cancelled && !controller.signal.aborted) {
          setActualites(data);
          // Mettre en cache
          recentCache.set(cacheKey, { data, timestamp: Date.now() });
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        }
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [limit]);

  return { actualites, loading, error };
}

// Hook pour une actualité par slug
export function useActualiteBySlug(slug: string) {
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await actualiteService.findBySlug(slug);
        if (!cancelled) setActualite(data);
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

  return { actualite, loading, error };
}
