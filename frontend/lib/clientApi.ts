// lib/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";

export const serverApi = {
  get: async (url: string) => {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    return axios.get(`http://localhost:8787/api/v1${url}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  // Add other methods as needed
};
