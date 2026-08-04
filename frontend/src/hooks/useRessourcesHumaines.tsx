import { useState, useEffect, useCallback, useRef } from 'react';
import { ressourceHumaineService } from '../services';
import type { RessourceHumaine } from '../types/ressource-humaine.types';
import type { PaginationResponse } from '../types/formations.types';

// Cache simple pour éviter les requêtes répétées
const paginationCache = new Map<
  string,
  { data: PaginationResponse<RessourceHumaine>; timestamp: number }
>();
const activeCache = new Map<string, { data: RessourceHumaine[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Hook pour toutes les ressources humaines avec pagination
export default function useRessourcesHumaines(page = 1, limit = 10) {
  const [data, setData] = useState<PaginationResponse<RessourceHumaine> | null>(null);
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
    const cacheKey = `ressources-humaines-${page}-${limit}`;
    const cached = paginationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ressourceHumaineService.findAll(page, limit, controller.signal);
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

// Hook pour les ressources humaines actives (section homepage)
export function useActiveRessourcesHumaines(limit = 100) {
  const [ressourcesHumaines, setRessourcesHumaines] = useState<RessourceHumaine[]>([]);
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
    const cacheKey = `active-ressources-humaines-${limit}`;
    const cached = activeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setRessourcesHumaines(cached.data);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ressourceHumaineService.findActive(controller.signal);
        if (!cancelled && !controller.signal.aborted) {
          setRessourcesHumaines(data);
          // Mettre en cache
          activeCache.set(cacheKey, { data, timestamp: Date.now() });
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

  return { ressourcesHumaines, loading, error };
}

// Hook pour une ressource humaine par slug
export function useRessourceHumaineBySlug(slug: string) {
  const [ressourceHumaine, setRessourceHumaine] = useState<RessourceHumaine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ressourceHumaineService.findBySlug(slug);
        if (!cancelled) setRessourceHumaine(data);
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

  return { ressourceHumaine, loading, error };
}
