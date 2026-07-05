'use client';
import { createContext, useCallback, useEffect, useState } from "react";
import { User } from "../services/userService";
import { ApiError } from "../core/http/interceptors";
import { authService, SignInPayload, SignUpPayload } from "../services/authService";
import { normalizeApiError } from "../core/http/api";
import { tokenService } from "../core/http/tokenService";

type LoadingState = {
  me: boolean;
  signUp: boolean;
  signIn: boolean;
  signOut: boolean;
};

const initialLoadingState: LoadingState = {
  me: false,
  signUp: false,
  signIn: false,
  signOut: false
};

export interface AuthContextProps {
  loading: LoadingState;
  me: () => Promise<User>;
  signIn: (payload: SignInPayload) => Promise<string>;
  signUp: (payload: SignUpPayload) => Promise<User>;
  signOut: () => Promise<void>;
  isSigned: boolean;
  signedUser: User|null;
  error: ApiError|null;
  resetSignedUser: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState<LoadingState>(initialLoadingState);
  const [signedUser, setSignedUser] = useState<User | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const setLoadingKey = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runWithState = useCallback(
    async function <T>(key: keyof LoadingState, action: () => Promise<T>): Promise<T> {
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

  const me = useCallback(
    () =>
    runWithState('me', async () => {
      const data = await authService.me();
      setSignedUser(data);
      return data;
    }),
    [runWithState]
  );

  const signIn = useCallback(
    (payload: SignInPayload) =>
    runWithState('signIn', async () => {
      const accessToken = await authService.signIn(payload);
      tokenService.set(accessToken);
      setSignedUser(await me());
      return accessToken;
    }),
    [runWithState, me]
  );

  const signUp = useCallback(
    (payload: SignUpPayload) =>
    runWithState('signUp', async () => {
      const signedUser = await authService.signUp(payload);
      await signIn({ email: payload.email, password: payload.password });
      return signedUser;
    }),
    [runWithState, signIn]
  );

  const signOut = useCallback(
    () =>
    runWithState('signOut', async () => {
      tokenService.remove();
      setSignedUser(null);
    }), 
    [runWithState]
  );

  const resetSignedUser = useCallback(() => {
    setSignedUser(null);
  }, []);

  useEffect(() => {
    async function loadSignedUser(): Promise<void> {
      const token = tokenService.get();
      if (token) {
        setSignedUser(await me());
      }
    }

    loadSignedUser();
  }, [me]);

  return (
    <AuthContext value={{ 
      loading,
      me,
      signIn,
      signUp,
      signOut,
      isSigned: !!signedUser,
      signedUser,
      error,
      resetSignedUser
    }}>
      {children}
    </AuthContext>
  );
}

export default AuthContext;
