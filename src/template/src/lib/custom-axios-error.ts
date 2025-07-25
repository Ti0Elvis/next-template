import { isAxiosError } from "axios";

export class CustomAxiosError extends Error {
  constructor(error: unknown) {
    let message = "";

    if (isAxiosError(error) === true) {
      const status = error.response?.status ?? 500;
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
    Object.setPrototypeOf(this, CustomAxiosError.prototype);
  }
}
