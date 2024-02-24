import React from "react";
import { useSelector } from "react-redux";
import useAuthRequest from "../../../../hooks/useAuthRequest";
import { ProfileCard } from "../../../../components/UsersProfileCard";
import * as SC from "./styles"


export const FriendsAndAllPanel = ({setAddAndRemoveFriend}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const allUsers = useSelector((state) => state.user.allUsers);
    const { sendRequest } = useAuthRequest();

    const handleAddFriend = async (userId) => {
        try {
            await sendRequest('http://localhost:3008/addFriend', 'POST', { friendId: userId })
            setAddAndRemoveFriend(prevState => ({ ...prevState, addFriendId: userId }));
        } catch (error) {
            console.error('Ошибка при добавлении друга:', error);
        }
    }

    const handleRemoveFriend = async (userId) => {
        try {
            await sendRequest('http://localhost:3008/removeFriend', 'POST', { friendId: userId })
            setAddAndRemoveFriend(prevState => ({ ...prevState, removeFriendId: userId }));
        } catch (error) {
            console.error('Ошибка при добавлении друга:', error);
        }
    }

    return (
        <>
            <SC.RibbonFriends>
                <h2>Друзья</h2>
                {allUsers
                    .filter(user => currentUser.friends && currentUser.friends.includes(user._id))
                    .map(user => (
                        <ProfileCard 
                            handleAction={handleRemoveFriend}
                            user={user}
                            key={user._id}
                        > 
                            Удалить из друзей
                        </ProfileCard>
                        ))}
            </SC.RibbonFriends>
            <SC.AllUsers>
                <h2>Не-друзья</h2>
                {allUsers
                    .filter(user => !currentUser.friends || !currentUser.friends.includes(user._id))
                    .filter(user => user._id !== currentUser._id)
                    .map(user => (
                        <ProfileCard 
                            handleAction={handleAddFriend}
                            user={user}
                            key={user._id}
                        > 
                            Добавить в друзья
                        </ProfileCard>
                    ))}
            </SC.AllUsers>
    </>
    )
}