import { api } from './api';
import { tokenService } from './tokenService';

export type ApiError = {
  message: string;
  status?: number;
  errors?: Record<string, string>;
  originalError?: unknown;
};

export function setupInterceptors() {
  api.interceptors.request.use(
    (config) => {
      const token = tokenService.get();

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
  
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.response) {
        return Promise.reject<ApiError>({
          message: 'Erro de rede ou servidor indisponível.',
          status: 0,
          originalError: error,
        });
      }

      if (error.response.status === 403) {
        return Promise.reject<ApiError>({
          message: 'Você não tem permissão para executar esta ação.',
          status: 403,
          originalError: error,
        });
      }

      if ([400, 422].includes(error.response.status)) {
        return Promise.reject<ApiError>({
          message: error.response.data?.message ?? 'Erros de validação.',
          status: 422,
          errors: error.response.data?.errors ?? {},
          originalError: error,
        });
      }

      if (error.response.status >= 500) {
        return Promise.reject<ApiError>({
          message: 'Erro interno do servidor.',
          status: error.response.status,
          originalError: error,
        });
      }

      return Promise.reject<ApiError>({
        message: error.response.data?.message ?? 'Falha na requisição.',
        status: error.response.status,
        originalError: error,
      });
    }
  );
}