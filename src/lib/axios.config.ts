import axios from "axios";

import { ENV_CLIENT } from "@/config/env-client";

const axiosInstance = axios.create({
  baseURL: ENV_CLIENT.NEXT_PUBLIC_API_BASE_URL,
  // withCredentials: true,
});

// axiosInstance.interceptors.request.use(
//   async (request) => {
//     const { token } = await getNextAuthToken();
//     if (token) {
//       request.headers["Authorization"] = `Bearer ${token.value}`; // for Node.js Express back-end
//     }
//     return request;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    return Promise.reject(JSON.stringify(error.response.data));
  }
);

export { axiosInstance };
