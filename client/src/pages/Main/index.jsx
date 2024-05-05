import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
                <Link to='/allUsers'><div>Add Friends</div></Link>
                <div>Walks</div>
                <div>Sniff the Tail</div>
            </NotificationPanel>

            <PhotoGallery />

            <FriendsPanel
                users={currentUser}
                currentUser={true}
            />

            <Blog />

        </Container>
    );
};