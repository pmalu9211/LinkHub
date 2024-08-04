import axios from "axios";

export const api = axios.create({
  baseURL: "https://medium.pictisschool.workers.dev/api/v1",
  withCredentials: true,
});
