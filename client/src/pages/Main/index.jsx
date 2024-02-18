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

    const [addAndRemoveFriend, setAddAndRemoveFriend] = useState({
        addFriendId: '',
        removeFriendId: ''
    })

    const [newPostFlag, setNewPostFlag] = useState(false)
    const [newPostData, setNewPostData] = useState({
        title: '',
        text: '',
        visibility: '',
    })

    const [editedPost, setEditedPost] = useState(null);



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
        
        try {
            await sendRequest('http://localhost:3008/updateCurrentUser', 'PUT', updatedInfo);
            dispatch(setCurrentUser(updatedInfo));
            fetchData();
            setEditing(false);
        } catch (error) {
            console.error('Ошибка при обновлении данных на сервере', error);
        }
    };

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

    const handleNewPost = () => {
        setNewPostFlag(true)
    }

    const handlePublishPost = async () => {
        const isTitleEmpty = newPostData.title.trim() === '';
        const isTextEmpty = newPostData.text.trim() === '';
        const isVisibilityEmpty = newPostData.visibility.trim() === '';
        
        if (isTitleEmpty || isTextEmpty || isVisibilityEmpty) {
            setValidationError('Пожалуйста, заполните все поля перед публикацией.');
            return;
        }       
        
        setNewPostFlag(false);

        try {
            await sendRequest('http://localhost:3008/newPost', "POST", newPostData);
            fetchData();
            setNewPostFlag(false);
        } catch (error) {
            console.error('Ошибка при добавлении нового поста на сервере', error);
        }
    }

    const deletePost = async (postId) => {
        console.log(postId);
        try {
            await sendRequest('http://localhost:3008/deletePost', "POST", {postId});
            fetchData();
        } catch (error) {
            console.error('Ошибка при удалении поста на сервере', error);
        }
    }

    const handleChangeNewPost = (e) => {
        const {name, value} = e.target
        setNewPostData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleEditPost = (e) => {
        const { name, value } = e.target;
    
        setEditedPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    
        setValidationError('');
    }

    const handleSaveChangesPost = async () => {
        const isTitleEmpty = editedPost.title.trim() === '';
        const isTextEmpty = editedPost.text.trim() === '';
        const isVisibilityEmpty = editedPost.visibility.trim() === '';
    
        if (isTitleEmpty || isTextEmpty || isVisibilityEmpty) {
            setValidationError('Пожалуйста, заполните все поля перед сохранением.');
            return;
        }
    
        try {
            await sendRequest('http://localhost:3008/editedPost', 'PUT', editedPost);
            fetchData();
            setEditedPost(null);
        } catch (error) {
            console.error('Ошибка при изменении поста', error);
        }
    }

    



    console.log(currentUser);

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
                    <h2>Друзья</h2>
                    {allUsers
                        .filter(user => currentUser.friends && currentUser.friends.includes(user._id))
                        .map(user => (
                            <SC.FriendsCard key={user._id}>
                                <SC.RibbonFriendsAvatar>Avatar</SC.RibbonFriendsAvatar>
                                <p>{user.name}</p>
                                <button onClick={() => handleRemoveFriend(user._id)}>Удалить из друзей</button>
                            </SC.FriendsCard>
                        ))}
                </SC.RibbonFriends>

                <SC.AllUsers>
                    <h2>Не-друзья</h2>
                    {allUsers
                        .filter(user => !currentUser.friends || !currentUser.friends.includes(user._id))
                        .filter(user => user._id !== currentUser._id)
                        .map(user => (
                            <SC.FriendsCard key={user._id}>
                                <SC.RibbonFriendsAvatar>Avatar</SC.RibbonFriendsAvatar>
                                <p>{user.name}</p>
                                <button onClick={() => handleAddFriend(user._id)}>Добавить в друзья</button>
                            </SC.FriendsCard>
                        ))}
                </SC.AllUsers>

                    <SC.BlogWrapper>
                        <SC.NewPostButton>
                        <button onClick={handleNewPost}>Новый пост</button>
                        </SC.NewPostButton>
                        {currentUser && currentUser.posts && (
                            currentUser.posts.map((post) => (
                                <>
                                    <SC.BlogAvatar>
                                    <SC.AvatarPost>Avatar</SC.AvatarPost>
                                    </SC.BlogAvatar>

                                    
                                    <SC.Post key={post._id}>
                                        <SC.TimePost>{new Date(post.createdAt).toLocaleString()}</SC.TimePost>
                                        <SC.TextPost>
                                    {editedPost ? (
                                        <>
                                            <input 
                                                placeholder='Title' 
                                                name='title' 
                                                value={editedPost.title} 
                                                onChange={handleEditPost}
                                            />
                                            <textarea 
                                                placeholder='Text'
                                                name='text' 
                                                value={editedPost.text} 
                                                onChange={handleEditPost}
                                            />
                                            <label>
                                                <input 
                                                    type='radio' 
                                                    name='visibility' 
                                                    value='Friends' 
                                                    onChange={handleEditPost} 
                                                />
                                                Для друзей
                                            </label>    
                                            <label>
                                                <input 
                                                    type='radio' 
                                                    name='visibility' 
                                                    value='Others' 
                                                    onChange={handleEditPost} 
                                                /> 
                                                Для всех
                                            </label>
                                            <button onClick={handleSaveChangesPost}>Сохранить</button>
                                        </>
                                    ) : (
                                        <>
                                            <h2>{post.title}</h2>
                                            <div>{post.text}</div>
                                            <button onClick={() => setEditedPost(post)}>Редактировать</button>
                                            <SC.DeletePost onClick={() => deletePost(post._id)}>Удалить</SC.DeletePost>

                                        </>
                                    )}
                                </SC.TextPost>
                                        <SC.FooterPosts>
                                        <button>Like</button>
                                        <button>Dislike</button>
                                        <button>Share</button>
                                        </SC.FooterPosts>
                                    </SC.Post>
                                </>
                        )))}
                    </SC.BlogWrapper>
                    
                {newPostFlag &&
                    <SC.NewPost>
                        <input type='text' name='title' placeholder='Title' onChange={handleChangeNewPost}/>
                        <textarea name='text' placeholder='Text' onChange={handleChangeNewPost} />
                        <label><input type='radio' name='visibility' value='Friends' onChange={handleChangeNewPost} />Для друзей</label>    
                        <label><input type='radio' name='visibility' value='Others' onChange={handleChangeNewPost} /> Для всех</label>
                        <input type='Submit' value='Опубликовать' onClick={handlePublishPost}/>
                    </SC.NewPost>
                }
            </SC.Wrapper>
        </>
    );
};