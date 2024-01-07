import axiosApi from "axios";
import { ApiUrl, server } from "./urls";
import Swal from "sweetalert2";

const axios = axiosApi.create({
    baseURL: ApiUrl,
    withCredentials: true,
});

axios.interceptors.request.use((config) => {
  config.headers["Access-Control-Allow-Origin"] = server;
  config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE";
  config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
  config.headers["Access-Control-Allow-Credentials"] = "true";
  return config;
});

axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        return Swal.fire("Unauthorized access").then(() => window.location.href = '/home');
      }
      else if (error.response && error.response.status === 403) {
        Swal.fire("Your account is banned").then(() => window.location.href = '/home')
      } 
      else if (error.response && error.response.status === 500) {
        return Swal.fire({
          backdrop: true,
          background: 'black',
          color: 'white',
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      } else {
        return Promise.reject(error);
      }
    }
);


export default axios;