import axiosApi from "axios";
import { ApiUrl } from "./urls";
import Swal from "sweetalert2";

const axios = axiosApi.create({
    baseURL: ApiUrl,
    withCredentials: true,
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