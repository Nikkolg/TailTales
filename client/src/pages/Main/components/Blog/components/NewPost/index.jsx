import React, { useState } from "react";
import { ErrorDisplay } from "../../../../../../components/UI/ErrorDisplay";
import { Button } from "../../../../../../components/UI/Button";
import { Input } from "../../../../../../components/UI/Input";
import { Textarea } from "../../../../../../components/UI/Textarea";
import * as SC from "./styles"

export const NewPost = ({setValidationError, handlePostOperation, validationError, setNewPostFlag}) => {
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
    
        setValidationError('');
    }

    const handlePublishPost = async () => {
        const isTitleEmpty = newPostData.title.trim() === '';
        const isTextEmpty = newPostData.text.trim() === '';
        const isVisibilityEmpty = newPostData.visibility.trim() === '';
        
        if (isTitleEmpty || isTextEmpty || isVisibilityEmpty) {
            setValidationError('Пожалуйста, заполните все поля перед публикацией.');
            return;
        }
        
        try {
            await handlePostOperation('http://localhost:3008/newPost', 'POST', newPostData);
            setNewPostFlag(false);
        } catch (error) {
            console.error('Ошибка при добавлении нового поста на сервере', error);
        }
    }

    return (
        <SC.NewPost>
                <Input type='text' name='title' placeholder='Title' onChange={handleChangeNewPost}/>
                <Textarea name='text' placeholder='Text' onChange={handleChangeNewPost} />
                <label><input type='radio' name='visibility' value='Friends' onChange={handleChangeNewPost} />Для друзей</label>    
                <label><input type='radio' name='visibility' value='Others' onChange={handleChangeNewPost} /> Для всех</label>
                <Button onClick={handlePublishPost}>Опубликовать</Button>
                {validationError && <ErrorDisplay error={validationError} />}
        </SC.NewPost>
    )
}