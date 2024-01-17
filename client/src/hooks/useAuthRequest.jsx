import { useState, useCallback } from 'react';

const useAuthRequest = () => {
    const [error, setError] = useState(null);

    const sendRequest = useCallback(
        async (url, method, body) => {
            try {
                const token = localStorage.getItem('token');
                console.log('Токен, отправляемый на сервер:', token);

                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
                if (token) {
                    headers = { ...headers, Authorization: `Bearer ${token}`};
                }

                const response = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                })
                if (!response.ok) {
                    const json = await response.json();
                    throw new Error(json.message || "Ошибка, запрос не выполнен");
                }
                return await response.json();
            } catch (e) {
                setError(e.message);
                console.error('Ошибка при запросе на сервер:', e);
            }
        }, []
    );

    const register = useCallback(
        async (url, body) => {
            return sendRequest(url, 'POST', body);
        },
        [sendRequest]
    );

    const get = useCallback(
        async (url) => {
            return sendRequest(url, 'GET', null);
        },
        [sendRequest]
    );

    return { sendRequest, register, get, error, setError };

};

export default useAuthRequest;
