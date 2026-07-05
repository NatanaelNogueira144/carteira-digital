import { User } from "./userService";
import { api } from "../core/http/api";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
}

export const authService = {
  async me() {
    const { data } = await api.get<User>(`/auth/me`);
    return data;
  },
  async signUp(payload: SignUpPayload) {
    const { data } = await api.post<User>('/auth/register', {...payload});
    return data;
  },
  async signIn(payload: SignInPayload) {
    const { data } = await api.post<SignInResponse>('/auth/login', {...payload});
    return data.accessToken;
  },
};