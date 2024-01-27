import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuthRequest from '../../hooks/useAuthRequest';
import { setAllUsers } from '../../redux/slices/userSlice';



export const MainPage = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const allUsers = useSelector((state) => state.user.allUsers);
    const { sendRequest } = useAuthRequest();
    const dispatch = useDispatch()

    console.log(currentUser);
    console.log('All Users:', allUsers);


    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await sendRequest('http://localhost:3008/allUsers', 'GET');
                if (res && res.users) {
                dispatch(setAllUsers(res.users));
            }
            } catch (error) {
                console.error('Ошибка при получении данных всех пользователей', error);
            }
        };
    
        fetchAllUsers();
    }, [sendRequest]);

    return (
        <>
            <div>
                <h1>MainPage</h1>
            </div>
        </>
    );
};