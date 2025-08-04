import { API } from "@/lib/constants";
import axios, { isAxiosError } from "axios";

export const axios_instance = axios.create({
  baseURL: API,
  withCredentials: true,
});

export class CustomAxiosError extends Error {
  status: number;

  constructor(error: unknown) {
    let message = "";
    let status = 500;

    if (isAxiosError(error) === true) {
      status = error.response?.status ?? 500;
      const p = error.response?.data?.message;

      if (status === 401 || status === 403) {
        message = "Access denied";
      } else if (p !== undefined) {
        message =
          Array.isArray(p?.message) === true ? p.message[0] : p.message ?? p;
      } else {
        message = "Server error";
      }
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Unknown error";
    }

    super(message);
    this.name = "CustomAxiosError";
    this.status = status;
    Object.setPrototypeOf(this, CustomAxiosError.prototype);
  }
}
