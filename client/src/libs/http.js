import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = `http://localhost:4200/`;

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 500) {
      toast("An unexpected error has occurred");
    } else {
      toast(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default axios;
