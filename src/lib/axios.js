import axios from "axios";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Burada yanıtları işleyebilirsiniz.
    return response;
  },
  (error) => {
    // Hata durumlarını ele alabilirsiniz.
    return Promise.reject(error);
  }
);

export default axiosInstance;
