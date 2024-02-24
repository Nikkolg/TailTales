import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuthRequest from '../../hooks/useAuthRequest';
import { logoutUser, setAllUsers, setCurrentUser } from '../../redux/slices/userSlice';
import { Container } from '../../components/UI/Container'
import { Header } from '../../components/Header'
import { ProfileCurrentUser } from './components/ProfileCurrentUser';
import { NotificationPanel } from './components/NotificationPanel';
import { PhotoGallery } from './components/Gallery';
import { FriendsAndAllPanel } from './components/FriendsAndAllPanel';
import { Blog } from './components/Blog';
import { Button } from '../../components/UI/Button';
import * as SC from "./styles"


export const MainPage = () => {
    const currentUser = useSelector((state) => state.user.currentUser);

    const { sendRequest } = useAuthRequest();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [validationError, setValidationError] = useState('');


    const [addAndRemoveFriend, setAddAndRemoveFriend] = useState({
        addFriendId: '',
        removeFriendId: ''
    })

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
}

    useEffect(() => {
        fetchData();
    }, [dispatch, sendRequest, addAndRemoveFriend]);
    
    async function userLogout() {
        try {
            await sendRequest('http://localhost:3008/logout', 'GET');
            dispatch(logoutUser())
            navigate('/')
        } catch (error) {
            console.error('Ошибка при выходе со страницы:', error);
        }
    }


    return (
        <Container>

            <Header>
                <Button onClick={userLogout}>Выход</Button>
            </Header>

            <ProfileCurrentUser 
                validationError={validationError}
                setValidationError={setValidationError}
                fetchData={fetchData}
                currentUser={currentUser}
            />

            <NotificationPanel />

            <PhotoGallery />


            <FriendsAndAllPanel
                setAddAndRemoveFriend={setAddAndRemoveFriend}
            />

            <Blog 
                fetchData={fetchData}
                setValidationError={setValidationError}
                validationError={validationError}
            />


        </Container>
    );
};