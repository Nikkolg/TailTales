import React, { useCallback, useEffect, useState } from 'react';
import useAuthRequest from '../../hooks/useAuthRequest';

export const MainPage = () => {
    const [user, setUser] = useState({});
    const { get } = useAuthRequest();

    const updateUser = useCallback(async () => {
        try {
            const result = await get('http://localhost:3008/user');
            console.log(result);
            setUser(result.user);

            if (result && Object.keys(result).length > 0) {
                setUser(result);
            } else {
                console.error('Ошибка при получении данных пользователя: Ответ от сервера не содержит данных пользователя');
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    }, [get]);

    useEffect(() => {
        updateUser();
    }, [updateUser]);

    return (
        <>
            <div>
                <h1>MainPage</h1>
                <p>User Name: {user && user.name}</p>
            </div>
        </>
    );
};