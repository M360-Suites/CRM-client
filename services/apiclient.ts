/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { STAGING_API_URL, PRODUCTION_API_URL } from "../constant";
import { ApiResponse } from "../types/common";
import { storage, getCookie } from "@/lib/handler";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const BASE_URL = IS_DEVELOPMENT ? STAGING_API_URL : PRODUCTION_API_URL;

export const authInstance = axios.create({
  baseURL: BASE_URL,
});

export const publicInstance = axios.create({
  baseURL: BASE_URL,
});

authInstance.interceptors.request.use((config) => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = getCookie(storage.ACCESS_TOKEN);
    console.log("Retrieved token from cookies:", !!token);
  }

  const authenticated = typeof window !== "undefined" && Boolean(token);

  if (authenticated && token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If you use httpOnly cookies for auth (cannot be read from JS), enable sending cookies:
  config.withCredentials = true;
  // and configure the server to accept credentials (Access-Control-Allow-Credentials + specific origin)
  return config;
});

authInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  },
);

class ApiClient {
  private handleError<T>(error: any): ApiResponse<T> {
    const axiosError = error as AxiosError<any>;
    return {
      status: false,
      message:
        axiosError.response?.data?.message || "An unexpected error occurred",
      errors: axiosError.response?.data?.errors || [],
    };
  }

  async get<T>(endpoint: string, requiresAuth = true): Promise<ApiResponse<T>> {
    try {
      const response = requiresAuth
        ? await authInstance.get<ApiResponse<T>>(endpoint)
        : await publicInstance.get<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      console.error("API GET Error:", error);
      return this.handleError(error);
    }
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    requiresAuth = true,
  ): Promise<ApiResponse<T>> {
    try {
      const isFormData = data instanceof FormData;
      const instance = requiresAuth ? authInstance : publicInstance;
      const response = await instance.post<ApiResponse<T>>(endpoint, data, {
        headers: isFormData
          ? { Accept: "application/json" }
          : {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
      });
      return response.data;
    } catch (error) {
      console.error("API POST Error:", error);
      return this.handleError(error);
    }
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    requiresAuth = true,
  ): Promise<ApiResponse<T>> {
    try {
      const isFormData = body instanceof FormData;
      const instance = requiresAuth ? authInstance : publicInstance;

      const res = await instance.put(endpoint, body, {
        headers: isFormData
          ? { Accept: "application/json" }
          : { Accept: "application/json", "Content-Type": "application/json" },
      });

      return res.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(
    endpoint: string,
    requiresAuth = true,
  ): Promise<ApiResponse<T>> {
    try {
      const res = requiresAuth
        ? await authInstance.delete(endpoint)
        : await publicInstance.delete(endpoint);

      return res.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }
}

export const apiClient = new ApiClient();