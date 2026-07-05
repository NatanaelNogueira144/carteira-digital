import { useCallback, useState } from 'react';
import { userService, User, UserPayload } from '../services/userService';
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

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const fetchUsers = useCallback(
    () =>
    runWithState('list', async () => {
      const users = await userService.list();
      setUsers(users);
      return users;
    }),
    [runWithState]
  );

  const showUser = useCallback(
    (id: number) =>
    runWithState('show', async () => {
      const data = await userService.show(id);
      setSelectedUser(data);
      return data;
    }),
    [runWithState]
  );

  const createUser = useCallback(
    (payload: UserPayload) =>
    runWithState('create', async () => {
      const createdUser = await userService.store(payload);
      setUsers((prev) => [createdUser, ...prev]);
      return createdUser;
    }),
    [runWithState]
  );

  const updateUser = useCallback(
    (id: number, payload: UserPayload) =>
    runWithState('update', async () => {
      const updatedUser = await userService.update(id, payload);

      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      setSelectedUser((prev) => prev?.id === id ? updatedUser : prev);

      return updatedUser;
    }),
    [runWithState]
  );

  const destroyUser = useCallback(
    (id: number) =>
    runWithState('destroy', async () => {
      await userService.destroy(id);

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setSelectedUser((prev) => (prev?.id === id ? null : prev));
    }),
    [runWithState]
  );

  const resetSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  return {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    showUser,
    createUser,
    updateUser,
    destroyUser,
    resetSelectedUser,
  };
}