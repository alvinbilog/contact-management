import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/contacts/',
});

apiClient.interceptors.request.use(
  (config) => {
    //modify config here
    console.log(config);
    return config;
  },
  (error) => {
    console.log(error);
    throw error;
  }
);

export default apiClient;
