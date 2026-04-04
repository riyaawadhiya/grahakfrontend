// src/api/queryKeys.js
export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'],
  },

  orders: {
    all:    ()        => ['orders'],
    lists:  ()        => ['orders', 'list'],
    list:   (filters) => ['orders', 'list', filters],
    detail: (id)      => ['orders', 'detail', id],
  },

  analytics: {
    all:    ()        => ['analytics'],
    period: (period)  => ['analytics', period],
  },

  profile: {
    me: () => ['profile', 'me'],
  },
};