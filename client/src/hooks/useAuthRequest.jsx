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
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
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

    return { sendRequest, register, error, setError };

};

export default useAuthRequest;
