import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "../../components/UI/Container";
import { Header } from "../../components/Header";
import { NotificationPanel } from "../Main/components/NotificationPanel";
import { FriendsPanel } from "../../components/FriendsPanel";
import { PostCard } from "../Main/components/Blog/components/Posts/components/PostCard";
import useLogout from "../../hooks/useLogout";
import { Button } from "../../components/UI/Button";
import { ShowInfo } from "../Main/components/ProfileCurrentUser/Components/ShowInfo";
import useAuthRequest from "../../hooks/useAuthRequest";
import useFetchData from "../../hooks/useFetchData";
import * as SC from "./styles"

export const UsersProfile = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const { userId } = useParams();
    const [userData, setUserData] = useState({});
    const { userLogout } = useLogout();
    const { sendRequest } = useAuthRequest();
    const { fetchData } = useFetchData();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const resUserData = await sendRequest(`http://localhost:3008/user/${userId}`, 'GET');

                if (resUserData && resUserData.user) {
                    setUserData(resUserData.user);
                } else {
                    navigate('/main');
                }
            } catch (error) {
                console.error('Ошибка при получении данных пользователя', error);
            }
            fetchData()
        };

        fetchUserData();
    }, [userId, sendRequest, navigate]);


    return (
        <Container>
            <Header>
                <Button><Link to='/main'>На главную</Link></Button>  
                <Button onClick={userLogout}>Выход</Button>
            </Header>

            <SC.Profile>
                <ShowInfo
                    user={userData}
                />
            </SC.Profile>

            <NotificationPanel>
                <div>Send Message</div>
                <div>Add friends</div>
                <div>Call Walk</div>
                <div>Sniff the tail</div>
            </NotificationPanel>
            

            <FriendsPanel 
                friends={userData.friends}
                currentUser={false}
            />

            <PostCard 
                user={userData} 
                currentUser={currentUser}
            />
        </Container>

    )
}