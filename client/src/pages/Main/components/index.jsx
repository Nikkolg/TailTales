import React, { useState } from "react";
import { styled } from "styled-components";
import { Button } from "../../../../components/UI/Button";
import { useSelector } from "react-redux";
import * as SC from "./styles"
import useAuthRequest from "../../../../hooks/useAuthRequest";



export const Blog = ({fetchData, setValidationError}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const { sendRequest } = useAuthRequest();


    const [newPostFlag, setNewPostFlag] = useState(false)
    const [newPostData, setNewPostData] = useState({
        title: '',
        text: '',
        visibility: '',
    })
    const [editedPost, setEditedPost] = useState (null)

    const handleNewPost = () => {
        setNewPostFlag(true)
    }
    console.log(editedPost);

    
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

    const handleEditPost = (e) => {
        const { name, value } = e.target;
    
        setEditedPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    
        setValidationError('');
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
    
    return (
        <>
        <SC.BlogWrapper>
            <SC.NewPostButton>
                <Button onClick={handleNewPost}>Новый пост</Button>
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
                )))
            }
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
    </>
    )
}