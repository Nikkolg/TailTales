import React from "react";
import { ErrorDisplay } from "../../../../../../../../components/UI/ErrorDisplay";

export const EditPostCard = ({editPost, setEditPost, setValidationError, validationError, handlePostOperation}) => {

    const handleEditPost = (e) => {
        const { name, value } = e.target;
    
        setEditPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    
        setValidationError('');
    }

    const handleSaveChangesPost = async () => {
        const isTitleEmpty = editPost.title.trim() === '';
        const isTextEmpty = editPost.text.trim() === '';
        const isVisibilityEmpty = editPost.visibility.trim() === '';
    
        if (isTitleEmpty || isTextEmpty || isVisibilityEmpty) {
            setValidationError('Пожалуйста, заполните все поля перед сохранением.');
            return;
        }

        try {
            await handlePostOperation('http://localhost:3008/editedPost', 'PUT', editPost);
            setEditPost(null)
        } catch (error) {
            console.error('Ошибка при изменении поста', error);
        }
    }

    return (
        <>
            <input 
                placeholder='Title' 
                name='title' 
                value={editPost.title} 
                onChange={handleEditPost}
            />
            <textarea 
                placeholder='Text'
                name='text' 
                value={editPost.text} 
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
            {validationError && <ErrorDisplay error={validationError} />}
        </>
    )
}