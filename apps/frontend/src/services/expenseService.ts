import { api } from "../core/http/api";

export interface Expense {
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

export interface ExpensePayload {
  amount: number;
  date: string;
  description: string;
  frequency: string;
}

export const expenseService = {
  async list() {
    const { data } = await api.get<Expense[]>('/expenses');
    return data;
  },
  async show(id: number) {
    const { data } = await api.get<Expense>(`/expenses/${id}`);
    return data;
  },
  async store(payload: ExpensePayload) {
    const { data } = await api.post<Expense>(`/expenses`, {...payload});
    return data;
  },
  async update(id: number, payload: ExpensePayload) {
    const { data } = await api.put<Expense>(`/expenses/${id}`, {...payload});
    return data;
  },
  async destroy(id: number) {
    const { data } = await api.delete<Expense>(`/expenses/${id}`);
    return data;
  },
};