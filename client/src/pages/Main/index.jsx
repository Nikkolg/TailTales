import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuthRequest from '../../hooks/useAuthRequest';
import { setAllUsers, setCurrentUser } from '../../redux/slices/userSlice';



export const MainPage = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const allUsers = useSelector((state) => state.user.allUsers);
    const { sendRequest } = useAuthRequest();
    const dispatch = useDispatch()

    console.log(currentUser);
    console.log('All Users:', allUsers);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCurrentUser = await sendRequest('http://localhost:3008/currentUser', 'GET');
                const resAllUsers = await sendRequest('http://localhost:3008/allUsers', 'GET');

                if (resCurrentUser && resCurrentUser.user) {
                    dispatch(setCurrentUser(resCurrentUser.user));
                }

                if (resAllUsers && resAllUsers.users) {
                    dispatch(setAllUsers(resAllUsers.users));
                }
            } catch (error) {
                console.error('Ошибка при получении данных', error);
            }
        };

        fetchData();
    }, [dispatch, sendRequest]);

    return (
        <>
            <div>
                <h1>MainPage</h1>
                <p>ID {currentUser.id}</p>
                <p>NAME {currentUser.name}</p>
                <p>EMAIL {currentUser.email}</p>
                <p>AGE {currentUser.age}</p>
                <img src={currentUser.avatar} alt="" />

            </div>
        </>
    );
};