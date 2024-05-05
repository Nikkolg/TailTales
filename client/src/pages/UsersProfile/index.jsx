import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "../../components/UI/Container";
import { Header } from "../../components/Header";
import { NotificationPanel } from "../Main/components/NotificationPanel";
import { FriendsPanel } from "../../components/FriendsPanel";
import { PostCard } from "../Main/components/Blog/components/Posts/components/PostCard";
import { Button } from "../../components/UI/Button";
import { ShowInfo } from "../Main/components/ProfileCurrentUser/Components/ShowInfo";
import { API_URLS } from "../../API/api_url";
import { setAddFriendId, setRemoveFriendId } from "../../redux/slices/userSlice";import useAuthRequest from "../../hooks/useAuthRequest";
import useFetchData from "../../hooks/useFetchData";
import useLogout from "../../hooks/useLogout";

import * as SC from "./styles"

const Loader = () => (
    <div>Загрузка...</div>
);

export const UsersProfile = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const { userId } = useParams();
    const [userData, setUserData] = useState({});
    const { userLogout } = useLogout();
    const { sendRequest } = useAuthRequest();
    const { fetchData } = useFetchData();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const resUserData = await sendRequest(`http://localhost:3008/user/${userId}`, "GET");
                if (resUserData && resUserData.user) {
                    setUserData(resUserData.user);
                    setLoading(false);
                    fetchData()
                } else {
                    navigate("/main");
                }
            } catch (error) {
                console.error("Ошибка при получении данных пользователя:", error);
                navigate("/main");
            }
        };

        fetchUserData();
    }, [userId, sendRequest, navigate]);

    const handleRemoveFriend = async (userId) => {
        try {
            await sendRequest(API_URLS.removeFriend, 'POST', { friendId: userId })
            dispatch(setRemoveFriendId(userId));
            fetchData()
        } catch (error) {
            console.error('Ошибка при добавлении друга:', error);
        }
    }

    const handleAddFriend = async (userId) => {
        try {            
            await sendRequest(API_URLS.addFriend, 'POST', { friendId: userId })
            dispatch(setAddFriendId(userId));
            fetchData()
        } catch (error) {
            console.error('Ошибка при добавлении друга:', error);
        }
    }
    

    if (loading || !currentUser) {
        return <Loader />;
    }

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
                {currentUser.friends.includes(userData._id) ? (
                        <SC.friends onClick={() => handleRemoveFriend(userData._id)}>
                            Удалить из друзей
                        </SC.friends>
                    ) : (
                        <SC.friends onClick={() => handleAddFriend(userData._id)}>
                            Добавить в друзья
                        </SC.friends>
                    )
                }
                <div>Call Walk</div>
                <div>Sniff the tail</div>
            </NotificationPanel>
            
            <FriendsPanel 
                users={userData}
                currentUser={true}
            />

            <PostCard 
                user={userData} 
                currentUser={currentUser}
            />
        </Container>

    )
}