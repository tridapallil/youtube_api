import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    key: process.env.API_KEY,
    chart: 'mostPopular',
  };
  return config;
});

export default api;
