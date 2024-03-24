import React from "react";
import { ErrorDisplay } from "../../../../../../../../components/UI/ErrorDisplay";
import { API_URLS } from "../../../../../../../../API/api_url";
import { useDispatch, useSelector } from "react-redux";
import { setValidationError } from "../../../../../../../../redux/slices/userSlice";

export const EditPostCard = ({editPost, setEditPost, handlePostOperation}) => {
    const validationError = useSelector((state) => state.user.validationError);
    const dispatch = useDispatch()

    const handleEditPost = (e) => {
        const { name, value } = e.target;
    
        setEditPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    
        dispatch(setValidationError(''))
    }

    const handleSaveChangesPost = async () => {
        const isTitleEmpty = editPost.title.trim() === '';
        const isTextEmpty = editPost.text.trim() === '';
        const isVisibilityEmpty = editPost.visibility.trim() === '';
    
        if (isTitleEmpty || isTextEmpty || isVisibilityEmpty) {
            dispatch(setValidationError('Пожалуйста, заполните все поля перед сохранением'));
            return;
        }

        try {
            await handlePostOperation(API_URLS.editedPost, 'PUT', editPost);
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