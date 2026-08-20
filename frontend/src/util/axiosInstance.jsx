import axios from "axios";

const api = axios.create({
  baseURL: "https://invoice-generator-z035.onrender.com",
  withCredentials: true, // needed for cookies
});

export default api;
