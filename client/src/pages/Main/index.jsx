import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuthRequest from '../../hooks/useAuthRequest';
import { logoutUser, setAllUsers, setCurrentUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import * as SC from "./styles"




export const MainPage = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const allUsers = useSelector((state) => state.user.allUsers);
    const { sendRequest } = useAuthRequest();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({
    name: currentUser.name,
    animalType: currentUser.animalType,
    age: currentUser.age,
    gender: currentUser.gender,
  });

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        dispatch(setCurrentUser(editedInfo));
        setEditing(false);
    };


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
        <>
            <SC.Wrapper>

                <SC.Footer>
                    <p>TailTales</p>
                    <button onClick={userLogout}>Выход</button>
                </SC.Footer>

                <SC.Profile>
                    <SC.AvatarCurrentUser>
                        Avatar
                    </SC.AvatarCurrentUser>


                    <SC.InfoCurrentUser>
                        {editing ? (
                            <>
                            <input
                                type="text"
                                name="name"
                                placeholder='name'
                                value={editedInfo.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="animalType"
                                placeholder='animalType'
                                value={editedInfo.animalType}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="age"
                                placeholder='age'
                                value={editedInfo.age}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="gender"
                                placeholder='gender'
                                value={editedInfo.gender}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleSaveChanges}>Сохранить</button>
                            </>
                        ) : (
                            <>
                            <h2>Name: {currentUser.name}</h2>
                            <h3>{currentUser.animalType}</h3>
                            <h3>{currentUser.age} years</h3>
                            <p>{currentUser.gender}</p>
                            <p>Location</p>
                            <p>About me</p>
                            <button onClick={handleEditToggle}>Редактировать</button>
                            </>
                        )}
                    </SC.InfoCurrentUser>
                </SC.Profile>

                <SC.ControlRibbon>
                    <SC.Element>Message</SC.Element>
                    <SC.Element>Friends</SC.Element>
                    <SC.Element>Walks</SC.Element>
                    <SC.Element>Sniff the Tail</SC.Element>
                </SC.ControlRibbon>

                <SC.Gallery>
                    Photo Gallery
                </SC.Gallery>

                <SC.RibbonFriends>
                    {allUsers.map(user => (
                        <SC.FriendsCard key={user.id}>
                            <SC.RibbonFriendsAvatar>Avatar</SC.RibbonFriendsAvatar>
                            <p>{user.name}</p>
                        </SC.FriendsCard>
                    ))}
                </SC.RibbonFriends>

                <SC.AllUsers>
                    {allUsers.map(user => (
                            <SC.FriendsCard key={user.id}>
                            <SC.RibbonFriendsAvatar>Avatar</SC.RibbonFriendsAvatar>
                            <p>{user.name}</p>
                            <button>Добавить в друзья</button>
                        </SC.FriendsCard>
                    ))}
                </SC.AllUsers>

            </SC.Wrapper>
        </>
    );
};