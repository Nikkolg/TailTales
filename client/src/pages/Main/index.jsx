import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../components/UI/Container'
import { Header } from '../../components/Header'
import { ProfileCurrentUser } from './components/ProfileCurrentUser';
import { NotificationPanel } from './components/NotificationPanel';
import { PhotoGallery } from './components/Gallery';
import { Blog } from './components/Blog';
import { Button } from '../../components/UI/Button';
import { FriendsPanel } from '../../components/FriendsPanel';
import useAuthRequest from '../../hooks/useAuthRequest';
import useLogout from '../../hooks/useLogout';
import useFetchData from '../../hooks/useFetchData';
import * as SC from "./styles"

export const MainPage = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const allUsers = useSelector((state) => state.user.allUsers);
    const dispatch = useDispatch();
    const { sendRequest } = useAuthRequest();
    const { userLogout } = useLogout();
    const { fetchData } = useFetchData();

    useEffect(() => {
        fetchData();
    }, [dispatch, sendRequest]);

    return (
        <Container>

            <Header>
                <Button onClick={userLogout}>Выход</Button>
            </Header>

            <ProfileCurrentUser />

            <NotificationPanel>
                <div>Message</div>
                <div>Friends</div>
                <div>Walks</div>
                <div>Sniff the Tail</div>
            </NotificationPanel>

            <PhotoGallery />

            <FriendsPanel
                friends={currentUser.friends}
                currentUser={true}
            />

            <FriendsPanel
                friends={allUsers}
                currentUser={false}
            />

            <Blog />

        </Container>
    );
};