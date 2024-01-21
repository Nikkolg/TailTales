import { useState, useCallback } from 'react';

const useAuthRequest = () => {
    const [error, setError] = useState(null);

    const sendRequest = useCallback(
        async (url, method, body) => {
            try {
                const sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)sessionId\s*=\s*([^;]*).*$)|^.*$/, '$1');
                // console.log('Session ID, отправляемый на сервер:', sessionId);

                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
                if (sessionId) {
                    headers = { ...headers, 'X-Session-ID': sessionId };
                }

                const response = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                })

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

    const get = useCallback(
        async (url) => {
            try {
                const sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)sessionId\s*=\s*([^;]*).*$)|^.*$/, '$1');
            
            if (!sessionId) {
                throw new Error('Сессия отсутствует или истекла');
            }

            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Session-ID': sessionId,
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
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
            }
        },
        [setError]
    );

    return { sendRequest, register, get, error, setError };

};

export default useAuthRequest;
