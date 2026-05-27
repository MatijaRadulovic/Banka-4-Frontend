// TODO: replace mock implementations with real API calls once backend endpoints exist

export const watchlistApi = {
  // TODO: GET /watchlists?user_id={userId}
  getWatchlists(userId) {
    return Promise.resolve([]);
  },

  // TODO: POST /watchlists { user_id, name }
  createWatchlist(userId, name) {
    return Promise.resolve({ id: null, name });
  },

  // TODO: PUT /watchlists/{id} { name }
  renameWatchlist(id, name) {
    return Promise.resolve({ id, name });
  },

  // TODO: DELETE /watchlists/{id}
  deleteWatchlist(id) {
    return Promise.resolve();
  },

  // TODO: POST /watchlists/{watchlistId}/securities { listing_id }
  addSecurity(watchlistId, listingId) {
    return Promise.resolve();
  },

  // TODO: DELETE /watchlists/{watchlistId}/securities/{listingId}
  removeSecurity(watchlistId, listingId) {
    return Promise.resolve();
  },
};
