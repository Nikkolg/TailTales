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
    const { updateCurrentUser } = useAuthRequest();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({
        name: currentUser.name,
        animalType: currentUser.animalType,
        age: currentUser.age,
        gender: currentUser.gender,
    });
    const [validationError, setValidationError] = useState('');
    const [showOtherFields, setShowOtherFields] = useState({
        animalType: {
            show: false,
            value: '',
        },
        gender: {
            show: false,
            value: '',
        },
    });

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'animalType' || name === 'gender') {
            setShowOtherFields((prevFields) => ({
                ...prevFields,
                [name]: {
                    ...prevFields[name],
                    show: value === 'Other',
                },
            }));
        }
        
        setEditedInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        
        setValidationError('');
    };

    const handleSaveChanges = async () => {
        const isNameEmpty = editedInfo.name.trim() === '';
        const isAgeEmpty = editedInfo.age.trim() === '';
        const isGenderEmpty = editedInfo.gender.trim() === '';
        const isAnimalTypeEmpty = editedInfo.animalType.trim() === '';
        const isOtherAnimalTypeEmpty = showOtherFields.animalType.show && showOtherFields.animalType.value.trim() === '';
        const isOtherGenderEmpty = showOtherFields.gender.show && showOtherFields.gender.value.trim() === '';
        
        if (isNameEmpty || isAgeEmpty || isGenderEmpty || isAnimalTypeEmpty || isOtherAnimalTypeEmpty || isOtherGenderEmpty) {
            setValidationError('Пожалуйста, заполните все поля перед сохранением.');
            return;
        }
        
        const updatedInfo = {
            ...editedInfo,
            animalType: showOtherFields.animalType.show ? showOtherFields.animalType.value : editedInfo.animalType,
            gender: showOtherFields.gender.show ? showOtherFields.gender.value : editedInfo.gender,
        };
        
        dispatch(setCurrentUser(updatedInfo));
        setEditing(false);

        try {
            await updateCurrentUser('http://localhost:3008/updateCurrentUser', updatedInfo);
            dispatch(setCurrentUser(updatedInfo));
            setEditing(false);
        } catch (error) {
            console.error('Ошибка при обновлении данных на сервере', error);
        }
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

                                <select
                                    name="animalType"
                                    value={editedInfo.animalType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">--Пожалуйста выберите из списка--</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Fish">Fish</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Reptile">Reptile</option>
                                    <option value="Other">Other</option>
                                </select>
                                {showOtherFields.animalType.show && (
                                    <input
                                        type="text"
                                        name="otherAnimalType"
                                        placeholder="animalType"
                                        value={showOtherFields.animalType.value}
                                        onChange={(e) => setShowOtherFields((prevFields) => ({
                                        ...prevFields,
                                        animalType: {
                                            ...prevFields.animalType,
                                            value: e.target.value,
                                        },
                                        }))}
                                    />
                                )}
                                
                                <input
                                    type="text"
                                    name="age"
                                    placeholder='age'
                                    value={editedInfo.age}
                                    onChange={handleInputChange}
                                />

                                <select
                                    name="gender"
                                    value={editedInfo.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">--Пожалуйста выберите из списка--</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {showOtherFields.gender.show && (
                                    <input
                                        type="text"
                                        name="otherGender"
                                        placeholder="gender"
                                        value={showOtherFields.gender.value}
                                        onChange={(e) => setShowOtherFields((prevFields) => ({
                                        ...prevFields,
                                        gender: {
                                            ...prevFields.gender,
                                            value: e.target.value,
                                        },
                                        }))}
                                    />
                                )}

                                <button onClick={handleSaveChanges}>Сохранить</button>
                                <p style={{ color: 'red' }}>{validationError}</p>

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