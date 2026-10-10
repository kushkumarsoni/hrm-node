import axios from 'axios';

const TOKEN_KEY = 'hrm_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const client = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1` });

client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error.response?.status;
    const isLogin = error.config?.url?.includes('/auth/login');

    if (status === 401 && !isLogin) {
      tokenStore.clear();
      window.location.href = '/login';
    }

    return Promise.reject({
      status,
      message: error.response?.data?.message || error.message || 'Something went wrong',
      errors: error.response?.data?.errors || null,
    });
  }
);

export default client;
