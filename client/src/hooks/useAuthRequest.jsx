import { useState, useCallback } from 'react';

export const useAuthRequest = () => {
    const [error, setError] = useState(null);
    const getToken = () => localStorage.getItem('token');
    
    const sendRequest = useCallback(
        async (url, method, body) => {
            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`,
                    },
                    body: body ? JSON.stringify(body) : undefined,
                });

                if (!response.ok) {
                    try {
                        const json = await response.json();
                        console.log(json);

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

    const publishNewPost = async (url, body) => {
        return sendRequest(url, 'POST', body);
    };

    return { sendRequest, register, updateCurrentUser, publishNewPost, error, setError };

};

export default useAuthRequest;
