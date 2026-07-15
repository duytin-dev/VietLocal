import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';

const GUEST_KEY = 'vivudi_favorites';

const FavoritesContext = createContext(null);

function readGuestFavorites() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGuestFavorites(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const favoriteIds = useMemo(() => new Set(items.map((d) => d.id)), [items]);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setItems(readGuestFavorites());
      return;
    }
    setLoading(true);
    try {
      const list = await api.getFavorites();
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems(readGuestFavorites());
      return undefined;
    }
    let cancelled = false;
    (async () => {
      const guest = readGuestFavorites();
      if (guest.length) {
        await Promise.all(guest.map((d) => api.addFavorite(d.id).catch(() => {})));
        localStorage.removeItem(GUEST_KEY);
      }
      if (cancelled) return;
      setLoading(true);
      try {
        const list = await api.getFavorites();
        if (!cancelled) setItems(list);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id]);

  const toggle = useCallback(
    async (destination) => {
      const isFav = favoriteIds.has(destination.id);
      if (isAuthenticated) {
        if (isFav) {
          await api.removeFavorite(destination.id);
          setItems((list) => list.filter((d) => d.id !== destination.id));
        } else {
          await api.addFavorite(destination.id);
          setItems((list) => [destination, ...list.filter((d) => d.id !== destination.id)]);
        }
        return;
      }
      if (isFav) {
        const next = items.filter((d) => d.id !== destination.id);
        setItems(next);
        writeGuestFavorites(next);
      } else {
        const next = [destination, ...items.filter((d) => d.id !== destination.id)];
        setItems(next);
        writeGuestFavorites(next);
      }
    },
    [favoriteIds, isAuthenticated, items],
  );

  const value = useMemo(
    () => ({
      items,
      favoriteIds,
      loading,
      isFavorite: (id) => favoriteIds.has(id),
      toggle,
      reload: load,
    }),
    [items, favoriteIds, loading, toggle, load],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
