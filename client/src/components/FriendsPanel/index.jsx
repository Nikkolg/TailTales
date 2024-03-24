import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProfileCard } from "../UsersProfileCard";
import { Button } from "../UI/Button";
import { API_URLS } from "../../API/api_url";
import { setAddFriendId, setRemoveFriendId } from "../../redux/slices/userSlice";
import useAuthRequest from "../../hooks/useAuthRequest";
import useFetchData from "../../hooks/useFetchData";
import * as SC from "./styles"

export const FriendsPanel = ({friends, currentUser}) => {
    const [friendsData, setFriendsData] = useState([])
    const { sendRequest } = useAuthRequest();
    const {fetchData} = useFetchData();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                const resFriendsData = await sendRequest(API_URLS.friendsData, 'POST', { friendId: friends });
                setFriendsData(resFriendsData.friendsData);
            } catch (error) {
                console.error('Ошибка при получении данных о друзьях:', error);
            }
        };
    
        fetchFriendsData();
    }, [friends]);

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

    return (
        <SC.RibbonFriends>
            <h2>Друзья</h2>
                {friendsData.map(user => (
                    <div key={user._id}>
                        <ProfileCard 
                            user={user}
                            key={user._id}
                        />
                        {currentUser ? ( 
                            <Button onClick={() => handleRemoveFriend(user._id)}>Удалить из друзей</Button>
                        ) : (
                            <Button onClick={() => handleAddFriend(user._id)}>Добавить в друзья</Button>
                        )
                        }
                    </div>
            ))}
        </SC.RibbonFriends>
    )
}