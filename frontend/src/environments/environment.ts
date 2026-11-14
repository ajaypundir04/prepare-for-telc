export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any).__env?.API_BASE_URL)
    ? `${(window as any).__env.API_BASE_URL}/api`
    : '/api'
};
