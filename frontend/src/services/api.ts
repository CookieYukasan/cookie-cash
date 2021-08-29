import axios from "axios";
import { parseCookies } from "nookies";
import { authToken } from "../contexts/AuthenticationContext";

export const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  if (cookies[authToken]) {
    config.headers["Authorization"] = cookies[authToken];
    console.log("teste");
  }

  return config;
});
