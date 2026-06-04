'use client';
import ISignInRequest from "../../core/interfaces/requests/sign-in-request.interface";
import ISignUpRequest from "../../core/interfaces/requests/sign-up-request.interface";
import IUser from "../../core/interfaces/models/user.model";
import useAPI from "../hooks/useAPI";
import useLocalStorage from "../hooks/useLocalStorage";
import { createContext, useEffect, useState } from "react";

export interface AuthContextProps {
    isLoading: boolean;
    isLoadingAuth: boolean;
    signIn: (request: ISignInRequest) => Promise<void>;
    signOut: () => void;
    signUp: (request: ISignUpRequest) => Promise<IUser>;
    signed: boolean;
    user: IUser|null;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const { get, set, remove } = useLocalStorage();
    const { api } = useAPI();

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);
    const [user, setUser] = useState(null as IUser|null);

    useEffect(() => {
        async function loadStorage(): Promise<void> {
            const token = get('@carteira-digital:access-token');
            if(token) {
                try {
                    setUser(await api.auth.me());
                } catch(error: unknown) {}
            }

            setIsLoading(false);
        }

        loadStorage();
    }, [api.auth, get]);

    async function signUp(request: ISignUpRequest): Promise<IUser|never> {
        try {
            setIsLoadingAuth(true);
            return await api.auth.signUp(request);
        } catch(error: unknown) {
            throw error;
        } finally {
            setIsLoadingAuth(false);
        }
    }

    async function signIn(request: ISignInRequest): Promise<void> {
        try {
            setIsLoadingAuth(true);
            const response = await api.auth.signIn(request);
            set('@carteira-digital:access-token', response.accessToken);
            setUser(await api.auth.me());
        } catch(error: unknown) {
            throw error;
        } finally {
            setIsLoadingAuth(false);
        }
    }

    function signOut(): void {
        try {
            setIsLoading(true);
            remove('@carteira-digital:access-token');
            setUser(null);
        } catch(error: unknown) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            isLoading, 
            isLoadingAuth,
            signIn, 
            signOut, 
            signUp, 
            signed: !!user, 
            user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
