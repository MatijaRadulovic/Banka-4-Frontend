import { create } from 'zustand';
import { watchlistApi } from '../api/endpoints/watchlist';

export const useWatchlistStore = create((set, get) => ({
  watchlists: [],
  userId: null,
  toastOpen: false,
  toastMsg: '',

  closeToast() {
    set({ toastOpen: false });
  },

  init(userId) {
    if (get().userId === userId) return;
    set({ userId });
    get().loadWatchlists();
  },

  async loadWatchlists() {
    try {
      const response = await watchlistApi.getWatchlists();
      const lists = Array.isArray(response) ? response : response?.data ?? [];

      const watchlists = await Promise.all(
        lists.map(async (list) => {
          if (!list?.id) return list;
          try {
            const details = await watchlistApi.getWatchlistById(list.id);
            return details?.data ?? details;
          } catch {
            return list;
          }
        })
      );

      set({ watchlists });
    } catch {
      set({ watchlists: [] });
    }
  },

  async createWatchlist(name) {
    try {
      const response = await watchlistApi.createWatchlist(name);
      const result = response?.data ?? response;
      await get().loadWatchlists();
      return result?.id ?? null;
    } catch {
      set({ toastOpen: true, toastMsg: 'Greška pri kreiranju liste. Pokušajte ponovo.' });
      return null;
    }
  },

  async deleteWatchlist(id) {
    try {
      await watchlistApi.deleteWatchlist(id);
      await get().loadWatchlists();
    } catch {
      set({ toastOpen: true, toastMsg: 'Greška pri brisanju liste. Pokušajte ponovo.' });
    }
  },

  async addSecurity(watchlistId, sec) {
    try {
      await watchlistApi.addSecurity(watchlistId, sec.id);
      await get().loadWatchlists();
    } catch {
      set({ toastOpen: true, toastMsg: 'Greška pri dodavanju hartije u listu. Pokušajte ponovo.' });
    }
  },

  async removeSecurity(watchlistId, secId) {
    try {
      await watchlistApi.removeSecurity(watchlistId, secId);
      await get().loadWatchlists();
    } catch {
      set({ toastOpen: true, toastMsg: 'Greška pri uklanjanju hartije iz liste. Pokušajte ponovo.' });
    }
  },

  isWatched(secId) {
    return get().watchlists.some(w => w.securities?.some(s => s.id === secId));
  },
}));
