import React, { useCallback, useEffect, useState } from 'react';
import useAuthRequest from '../../hooks/useAuthRequest';

export const MainPage = () => {
    const [user, setUser] = useState({});
    const { get } = useAuthRequest();

    const updateUser = useCallback(async () => {
        try {
            const result = await get('http://localhost:3008/user');
            console.log(result);
            setUser(result);
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