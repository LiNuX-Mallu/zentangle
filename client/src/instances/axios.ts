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
        return Swal.fire("Unauthorized access");
      } else if (error.response && error.response.status === 403) {
        return Swal.fire("Your account is banned");
      } else if (error.response && error.response.status === 500) {
          return Swal.fire({
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