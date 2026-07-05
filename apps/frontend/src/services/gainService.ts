import { api } from "../core/http/api";

export interface Gain {
  id: number;
  userId: number;
  amount: number;
  date: string;
  description: string;
  frequency: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface GainPayload {
  amount: number;
  date: string;
  description: string;
  frequency: string;
}

export const gainService = {
  async list() {
    const { data } = await api.get<Gain[]>('/gains');
    return data;
  },
  async show(id: number) {
    const { data } = await api.get<Gain>(`/gains/${id}`);
    return data;
  },
  async store(payload: GainPayload) {
    const { data } = await api.post<Gain>(`/gains`, {...payload});
    return data;
  },
  async update(id: number, payload: GainPayload) {
    const { data } = await api.put<Gain>(`/gains/${id}`, {...payload});
    return data;
  },
  async destroy(id: number) {
    const { data } = await api.delete<Gain>(`/gains/${id}`);
    return data;
  },
};