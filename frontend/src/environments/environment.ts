export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // 1. Check local storage override if user configured it in the UI
    const custom = localStorage.getItem('telc_api_base_url');
    if (custom && custom.trim() !== '') {
      return custom.replace(/\/+$/, '') + '/api';
    }
    // 2. Check build-time / runtime injected window.__env
    const envUrl = (window as any).__env?.API_BASE_URL;
    if (envUrl && envUrl.trim() !== '') {
      return envUrl.replace(/\/+$/, '') + '/api';
    }
  }
  return '/api';
}

export const environment = {
  production: true,
  get apiUrl(): string {
    return getApiBaseUrl();
  }
};
