export const RATE_LIMIT_CONFIG = {
  'POST /auth/login': {
    limit: 5,
    ttl: 60,
  },
  'POST /auth/register': {
    limit: 3,
    ttl: 300,
  },
  'POST /auth/refresh': {
    limit: 10,
    ttl: 60,
  },

  // DEFAULTS
  DEFAULT_AUTHENTICATED: {
    limit: 100,
    ttl: 60,
  },

  DEFAULT_PUBLIC: {
    limit: 20,
    ttl: 60,
  },
};
