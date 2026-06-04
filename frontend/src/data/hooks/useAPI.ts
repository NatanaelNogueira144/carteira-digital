import APIError from "../../core/exceptions/api-error.exception";
import IBaseResponse from "../../core/interfaces/responses/base-response.interface";
import IExpense from "../../core/interfaces/models/expense.model";
import IGain from "../../core/interfaces/models/gain.model";
import IRequestErrorsResponse from "../../core/interfaces/requests/request-error-response.interface";
import ISaveExpenseRequest from "../../core/interfaces/requests/save-expense-request.interface";
import ISaveGainRequest from "../../core/interfaces/requests/save-gain-request.interface";
import ISaveUserRequest from "../../core/interfaces/requests/save-user-request.interface";
import ISignInRequest from "../../core/interfaces/requests/sign-in-request.interface";
import ISignInResponse from "../../core/interfaces/responses/sign-in-response.interface";
import ISignUpRequest from "../../core/interfaces/requests/sign-up-request.interface";
import IUser from "../../core/interfaces/models/user.model";
import useHttp from "./useHttp";
import useLocalStorage from "./useLocalStorage";
import { HttpBody } from "../../core/types/http-body";
import { HttpHeaders } from "../../core/types/http-headers";
import { useCallback, useMemo } from "react";
import { GainsList } from "../../core/types/gains-list.type";
import { ExpensesList } from "../../core/types/expenses-list.type";

const API_BASE = process.env.REACT_APP_API_URL;

export default function useAPI() {
    const { get } = useLocalStorage();
    const { httpGet, httpPost, httpPut, httpDelete, isLoading } = useHttp();

    const prepareHeaders = useCallback(async (
        headers?: HttpHeaders
    ): Promise<HttpHeaders> => {
        const token: string|undefined = await get('@carteira-digital:access-token') as string|undefined;

        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
            ...headers
        };
    }, [get]);

    const getRequest = useCallback(async <R = IBaseResponse>(
        uri: string, 
        headers?: HttpHeaders
    ): Promise<R|never> => {
        const response = await httpGet(`${API_BASE}/${uri}`, await prepareHeaders(headers));
        if(!response.ok) {
            if(response.status === 404) {
                throw new APIError('Nada foi encontrado!');
            } else if(response.status === 403) {
                throw new APIError('Você não tem permissão para realizar esta ação!');
            } else {
                throw new Error('Lamentamos, mas ocorreu um erro ao executar esta ação!');
            }
        }

        return await response.json() as R;
    }, [httpGet, prepareHeaders]);

    const postRequest = useCallback(async <R = IBaseResponse>(
        uri: string, 
        body: HttpBody, 
        headers?: HttpHeaders
    ): Promise<R|never> => {
        const response = await httpPost(`${API_BASE}/${uri}`, body, await prepareHeaders(headers));
        if(!response.ok) {
            if(response.status === 404) {
                throw new APIError('Nada foi encontrado!');
            } else if(response.status === 403) {
                throw new APIError('Você não tem permissão para realizar esta ação!');
            } else if(response.status === 422 || response.status === 400) {
                const errors = (await response.json() as IRequestErrorsResponse).errors;
                throw new APIError('Erros de validação! Verifique os dados.', errors);
            } else {
                throw new Error('Lamentamos, mas ocorreu um erro ao executar esta ação!');
            }
        }

        return await response.json() as R;
    }, [httpPost, prepareHeaders]);

    const putRequest = useCallback(async <R = IBaseResponse>(
        uri: string, 
        body: HttpBody, 
        headers?: HttpHeaders
    ): Promise<R|never> => {
        const response = await httpPut(`${API_BASE}/${uri}`, body, await prepareHeaders(headers));
        if(!response.ok) {
            if(response.status === 404) {
                throw new APIError('Nada foi encontrado!');
            } else if(response.status === 403) {
                throw new APIError('Você não tem permissão para realizar esta ação!');
            } else if(response.status === 422 || response.status === 400) {
                const errors = (await response.json() as IRequestErrorsResponse).errors;
                throw new APIError('Erros de validação! Verifique os dados.', errors);
            } else {
                throw new Error('Lamentamos, mas ocorreu um erro ao executar esta ação!');
            }
        }

        return await response.json() as R;
    }, [httpPut, prepareHeaders]);

    const deleteRequest = useCallback(async <R = IBaseResponse>(
        uri: string, 
        headers?: HttpHeaders
    ): Promise<R|never> => {
        const response = await httpDelete(`${API_BASE}/${uri}`, await prepareHeaders(headers));
        if(!response.ok) {
            if(response.status === 404) {
                throw new APIError('Nada foi encontrado!');
            } else if(response.status === 403) {
                throw new APIError('Você não tem permissão para realizar esta ação!');
            } else {
                throw new Error('Lamentamos, mas ocorreu um erro ao executar esta ação!');
            }
        }

        return await response.json() as R;
    }, [httpDelete, prepareHeaders]);

    const api = useMemo(() => ({
        auth: {
            me: async (): Promise<IUser> => await getRequest<IUser>(`auth/me`),
            signUp: async (request: ISignUpRequest) => {
                return await postRequest<IUser>('auth/register', {...request});
            },
            signIn: async (request: ISignInRequest) => {
                return await postRequest<ISignInResponse>('auth/login', {
                    email: request.email,
                    password: request.password
                });
            }
        },
        users: {
            list: async (): Promise<IUser[]> => await getRequest<IUser[]>('users'),
            show: async (id: number): Promise<IUser> => await getRequest<IUser>(`users/${id}`),
            store: async (request: ISaveUserRequest): Promise<IUser> => {
                return await postRequest<IUser>('users', {...request});
            },
            update: async (id: number, request: ISaveUserRequest): Promise<IUser> => {
                return await putRequest<IUser>(`users/${id}`, {...request});
            },
            destroy: async (id: number): Promise<IUser> => await deleteRequest<IUser>(`users/${id}`)
        },
        gains: {
            list: async (): Promise<GainsList> => {
                const gains = await getRequest<GainsList>('gains');
                gains.forEach(gain => gain.date = gain.date.replace('Z', ''));
                return gains;
            },
            show: async (id: number): Promise<IGain> => await getRequest<IGain>(`gains/${id}`),
            store: async (request: ISaveGainRequest): Promise<IGain> => {
                return await postRequest<IGain>('gains', {...request});
            },
            update: async (id: number, request: ISaveGainRequest): Promise<IGain> => {
                return await putRequest<IGain>(`gains/${id}`, {...request});
            },
            destroy: async (id: number): Promise<IGain> => await deleteRequest<IGain>(`gains/${id}`)
        },
        expenses: {
            list: async (): Promise<ExpensesList> => {
                const expenses = await getRequest<ExpensesList>('expenses');
                expenses.forEach(expense => expense.date = expense.date.replace('Z', ''));
                return expenses;
            },
            show: async (id: number): Promise<IExpense> => await getRequest<IExpense>(`expenses/${id}`),
            store: async (request: ISaveExpenseRequest): Promise<IExpense> => {
                return await postRequest<IExpense>('expenses', {...request});
            },
            update: async (id: number, request: ISaveExpenseRequest): Promise<IExpense> => {
                return await putRequest<IExpense>(`expenses/${id}`, {...request});
            },
            destroy: async (id: number): Promise<IExpense> => await deleteRequest<IExpense>(`expenses/${id}`)
        }
    }), [getRequest, postRequest, putRequest, deleteRequest]);

    return { api, isLoading };
}