import axios from "axios";
import { API } from "@/lib/constants";

export const request = axios.create({
  withCredentials: true,
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});
