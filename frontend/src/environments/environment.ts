export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // 1. Check build-time or runtime injected window.__env
    const envUrl = (window as any).__env?.API_BASE_URL;
    if (envUrl && envUrl.trim() !== '') {
      return envUrl.replace(/\/+$/, '') + '/api';
    }
    // 2. Check local storage override if present
    const custom = localStorage.getItem('telc_api_base_url');
    if (custom && custom.trim() !== '') {
      return custom.replace(/\/+$/, '') + '/api';
    }
  }
  // Default Render production backend
  return 'https://prepare-for-telc.onrender.com/api';
}

export const environment = {
  production: true,
  get apiUrl(): string {
    return getApiBaseUrl();
  }
};
