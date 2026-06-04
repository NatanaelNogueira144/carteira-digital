'use client';
import { useCallback, useState } from 'react';
import { HttpHeaders } from '../../core/types/http-headers';
import { HttpBody } from '../../core/types/http-body';

export default function useHttp() {
    const [isLoading, setIsLoading] = useState(false);

    const sendAndGetData = useCallback(async (
        method: string, 
        url: string, 
        headers?: HttpHeaders,
        body?: HttpBody 
    ): Promise<Response> => {
        setIsLoading(true);
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null
        });
        setIsLoading(false);

        return response;
    }, []);

    const httpGet = useCallback(async (
        url: string, 
        headers?: HttpHeaders
    ): Promise<Response> => await sendAndGetData('GET', url, headers), [sendAndGetData]);

    const httpPost = useCallback(async (
        url: string, 
        body: HttpBody, 
        headers?: HttpHeaders
    ): Promise<Response> => await sendAndGetData('POST', url, headers, body), [sendAndGetData]);

    const httpPut = useCallback(async (
        url: string, 
        body: HttpBody, 
        headers?: HttpHeaders
    ): Promise<Response> => await sendAndGetData('PUT', url, headers, body), [sendAndGetData]);

    const httpPatch = useCallback(async (
        url: string, 
        body: HttpBody, 
        headers?: HttpHeaders
    ): Promise<Response> => await sendAndGetData('PATCH', url, headers, body), [sendAndGetData]);

    const httpDelete = useCallback(async (
        url: string, 
        headers?: HttpHeaders
    ): Promise<Response> => await sendAndGetData('DELETE', url, headers), [sendAndGetData]);

    return { httpGet, httpPost, httpPut, httpPatch, httpDelete, isLoading };
}
