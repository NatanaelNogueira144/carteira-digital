import { useCallback, useState } from 'react';
import { expenseService, Expense, ExpensePayload } from '../services/expenseService';
import { normalizeApiError } from '../core/http/api';
import { ApiError } from '../core/http/interceptors';

type LoadingState = {
  list: boolean;
  show: boolean;
  create: boolean;
  update: boolean;
  destroy: boolean;
};

const initialLoadingState: LoadingState = {
  list: false,
  show: false,
  create: false,
  update: false,
  destroy: false,
};

export function useExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState<LoadingState>(initialLoadingState);
  const [error, setError] = useState<ApiError | null>(null);

  const setLoadingKey = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runWithState = useCallback(
    async <T>(key: keyof LoadingState, action: () => Promise<T>): Promise<T> => {
      try {
        setError(null);
        setLoadingKey(key, true);

        return await action();
      } catch (err) {
        const parsedError = normalizeApiError(err);
        setError(parsedError);
        throw parsedError;
      } finally {
        setLoadingKey(key, false);
      }
    },
    [setLoadingKey]
  );

  const fetchExpenses = useCallback(
    () =>
    runWithState('list', async () => {
      const expenses = await expenseService.list();
      expenses.forEach(expense => expense.date = expense.date.replace('Z', ''));
      setExpenses(expenses);
      return expenses;
    }),
    [runWithState]
  );

  const showExpense = useCallback(
    (id: number) =>
    runWithState('show', async () => {
      const data = await expenseService.show(id);
      setSelectedExpense(data);
      return data;
    }),
    [runWithState]
  );

  const createExpense = useCallback(
    (payload: ExpensePayload) =>
    runWithState('create', async () => {
      const createdExpense = await expenseService.store(payload);
      setExpenses((prev) => [createdExpense, ...prev]);
      return createdExpense;
    }),
    [runWithState]
  );

  const updateExpense = useCallback(
    (id: number, payload: ExpensePayload) =>
    runWithState('update', async () => {
      const updatedExpense = await expenseService.update(id, payload);

      setExpenses((prev) => prev.map((expense) => (expense.id === id ? updatedExpense : expense)));
      setSelectedExpense((prev) => prev?.id === id ? updatedExpense : prev);

      return updatedExpense;
    }),
    [runWithState]
  );

  const destroyExpense = useCallback(
    (id: number) =>
    runWithState('destroy', async () => {
      await expenseService.destroy(id);

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      setSelectedExpense((prev) => (prev?.id === id ? null : prev));
    }),
    [runWithState]
  );

  const resetSelectedExpense = useCallback(() => {
    setSelectedExpense(null);
  }, []);

  return {
    expenses,
    selectedExpense,
    loading,
    error,
    fetchExpenses,
    showExpense,
    createExpense,
    updateExpense,
    destroyExpense,
    resetSelectedExpense,
  };
}