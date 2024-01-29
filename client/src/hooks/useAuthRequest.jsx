import { useState, useCallback } from 'react';

const useAuthRequest = () => {
    const [error, setError] = useState(null);

    const sendRequest = useCallback(
        async (url, method, body) => {
            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: body ? JSON.stringify(body) : undefined,
                });

                if (!response.ok) {
                    try {
                        const json = await response.json();
                        throw new Error(json.message || "Ошибка, запрос не выполнен");
                    } catch (jsonError) {
                        throw new Error(`Ошибка, запрос не выполнен: ${response.statusText}`);
                    }
                }
                
                return await response.json();
            } catch (e) {
                setError(e.message);
                console.error('Ошибка при запросе на сервер:', e);
                throw e;
            }
        }, []
    );

    const register = useCallback(
        async (url, body) => {
            return sendRequest(url, 'POST', body);
        },
        [sendRequest]
    );

    const updateCurrentUser = async (url, body) => {
        return sendRequest(url, 'PUT', body);
    };

    return { sendRequest, register, updateCurrentUser, error, setError };

};

export default useAuthRequest;
