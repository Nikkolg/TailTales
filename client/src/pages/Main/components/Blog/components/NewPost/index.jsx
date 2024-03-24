import React, { useState } from "react";
import { ErrorDisplay } from "../../../../../../components/UI/ErrorDisplay";
import { Button } from "../../../../../../components/UI/Button";
import { Input } from "../../../../../../components/UI/Input";
import { Textarea } from "../../../../../../components/UI/Textarea";
import { API_URLS } from "../../../../../../API/api_url";
import { useDispatch, useSelector } from "react-redux";
import { setValidationError } from "../../../../../../redux/slices/userSlice";
import useFetchData from "../../../../../../hooks/useFetchData";
import * as SC from "./styles"

export const NewPost = ({handlePostOperation, setNewPostFlag}) => {
    const dispatch = useDispatch()
    const {fetchData} = useFetchData()
    const validationError = useSelector((state) => state.user.validationError);
    const [newPostData, setNewPostData] = useState({
        title: '',
        text: '',
        visibility: '',
    })

    const handleChangeNewPost = (e) => {
        const { name, value } = e.target;
    
        setNewPostData((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    
        dispatch(setValidationError(''))
    }

    const handlePublishPost = async () => {
        const isTitleEmpty = newPostData.title.trim() === '';
        const isTextEmpty = newPostData.text.trim() === '';
        const isVisibilityEmpty = newPostData.visibility.trim() === '';
        
        if (isTitleEmpty || isTextEmpty || isVisibilityEmpty) {
            dispatch(setValidationError('Пожалуйста, заполните все поля перед публикацией'));
            return;
        }
        
        try {
            await handlePostOperation(API_URLS.newPost, 'POST', newPostData);
            fetchData()
            setNewPostFlag(false);
        } catch (error) {
            console.error('Ошибка при добавлении нового поста на сервере', error);
        }
    }

    const handleCancel = () => {
        setNewPostFlag(false);
    };

    return (
        <SC.NewPost>
                <Input type='text' name='title' placeholder='Title' onChange={handleChangeNewPost}/>
                <Textarea name='text' placeholder='Text' onChange={handleChangeNewPost} />
                <label><input type='radio' name='visibility' value='Friends' onChange={handleChangeNewPost} />Для друзей</label>    
                <label><input type='radio' name='visibility' value='Others' onChange={handleChangeNewPost} /> Для всех</label>
                <Button onClick={handlePublishPost}>Опубликовать</Button>
                <Button onClick={handleCancel}>Отмена</Button>
                {validationError && <ErrorDisplay error={validationError} />}
        </SC.NewPost>
    )
}