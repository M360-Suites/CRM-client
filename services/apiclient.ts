/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { PRODUCTION_API_URL } from "../constant";
import { ApiResponse } from "../types/common";
import { storage } from "@/lib/handler";
import Cookies from "js-cookie";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const BASE_URL = IS_DEVELOPMENT ? "/api/proxy" : PRODUCTION_API_URL;

export const authInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const publicInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(storage.ACCESS_TOKEN);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  config.withCredentials = true;
  return config;
});

authInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    console.log("error from response interceptor:", err);
    if (err.response?.status === 401) {
      window.location.href = "/login";
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

  async get<T>(
    endpoint: string,
    requiresAuth = true,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = requiresAuth
        ? await authInstance.get<ApiResponse<T>>(endpoint, { params })
        : await publicInstance.get<ApiResponse<T>>(endpoint, { params });
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

  async patch<T>(
    endpoint: string,
    body: unknown,
    requiresAuth = true,
  ): Promise<ApiResponse<T>> {
    try {
      const isFormData = body instanceof FormData;
      const instance = requiresAuth ? authInstance : publicInstance;

      const res = await instance.patch(endpoint, body, {
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
