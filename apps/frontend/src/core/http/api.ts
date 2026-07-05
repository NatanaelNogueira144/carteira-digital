import axios from "axios";
import { ApiError } from "./interceptors";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  );
}

export function normalizeApiError(error: unknown): ApiError {
  return isApiError(error)
    ? error
    : { message: 'Erro inesperado.', originalError: error };
}