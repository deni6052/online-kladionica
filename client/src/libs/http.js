import axios from "axios";

const http = axios.create({
  baseURL: `http://localhost:4200/`,
});

export default http;
