import { api } from "../core/http/api";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  async list() {
    const { data } = await api.get<User[]>('/users');
    return data;
  },
  async show(id: number) {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
  async store(payload: UserPayload) {
    const { data } = await api.post<User>(`/users`, {...payload});
    return data;
  },
  async update(id: number, payload: UserPayload) {
    const { data } = await api.put<User>(`/users/${id}`, {...payload});
    return data;
  },
  async destroy(id: number) {
    const { data } = await api.delete<User>(`/users/${id}`);
    return data;
  },
};