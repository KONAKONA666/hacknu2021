import axios from "axios";

export const apiBaseUrl = "http://localhost:5000/";
export const apiBaseUrlMl = "http://localhost:5001/";

export const controller = axios.create({
  baseURL: apiBaseUrl,
  responseType: "json"
});

export const controllerMl = axios.create({
  baseURL: apiBaseUrlMl,
  responseType: "json"
});
