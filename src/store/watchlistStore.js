import { create } from 'zustand';

const KEY = 'wl';

function load(uid) {
  try { return JSON.parse(localStorage.getItem(`${KEY}_${uid}`)) ?? []; }
  catch { return []; }
}

function save(uid, lists) {
  localStorage.setItem(`${KEY}_${uid}`, JSON.stringify(lists));
}

export const useWatchlistStore = create((set, get) => ({
  watchlists: [],
  userId: null,

  init(userId) {
    if (get().userId === userId) return;
    set({ watchlists: load(userId), userId });
  },

  createWatchlist(name) {
    const { userId, watchlists } = get();
    const id = `wl_${Date.now()}`;
    const updated = [...watchlists, { id, name, securities: [] }];
    set({ watchlists: updated });
    save(userId, updated);
    return id;
  },

  renameWatchlist(id, name) {
    const { userId, watchlists } = get();
    const updated = watchlists.map(w => w.id === id ? { ...w, name } : w);
    set({ watchlists: updated });
    save(userId, updated);
  },

  deleteWatchlist(id) {
    const { userId, watchlists } = get();
    const updated = watchlists.filter(w => w.id !== id);
    set({ watchlists: updated });
    save(userId, updated);
  },

  addSecurity(watchlistId, sec) {
    const { userId, watchlists } = get();
    const updated = watchlists.map(w => {
      if (w.id !== watchlistId) return w;
      if (w.securities.some(s => s.id === sec.id)) return w;
      return { ...w, securities: [...w.securities, sec] };
    });
    set({ watchlists: updated });
    save(userId, updated);
  },

  removeSecurity(watchlistId, secId) {
    const { userId, watchlists } = get();
    const updated = watchlists.map(w => {
      if (w.id !== watchlistId) return w;
      return { ...w, securities: w.securities.filter(s => s.id !== secId) };
    });
    set({ watchlists: updated });
    save(userId, updated);
  },

  isWatched(secId) {
    return get().watchlists.some(w => w.securities.some(s => s.id === secId));
  },
}));
