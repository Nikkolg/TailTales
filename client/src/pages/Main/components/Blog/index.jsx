import React, { useState } from "react";
import useAuthRequest from "../../../../hooks/useAuthRequest";
import { NewPost } from './components/NewPost'
import { Posts } from './components/Posts'
import { Button } from "../../../../components/UI/Button";
import * as SC from "./styles"

export const Blog = ({fetchData, setValidationError, validationError}) => {
    const [newPostFlag, setNewPostFlag] = useState(false)
    const { sendRequest } = useAuthRequest();

    const handleNewPost = () => {
        setNewPostFlag(true)
    }

    const handlePostOperation = async (url, method, data) => {
        try {
            await sendRequest(url, method, data);
            fetchData();
        } catch (error) {
            console.error('Ошибка при выполнении операции с постом', error);
        }
    };
    
    return (
        <SC.BlogWrapper>
            <Button onClick={handleNewPost}>Новый пост</Button>
            <>
            {newPostFlag ? (
                <NewPost 
                    setValidationError={setValidationError}
                    setNewPostFlag={setNewPostFlag}
                    handlePostOperation={handlePostOperation}
                    validationError={validationError}
                />
                ) : (
                <Posts 
                    setValidationError={setValidationError}
                    validationError={validationError}
                    handlePostOperation={handlePostOperation}
                />
            )}
            </>
        </SC.BlogWrapper>

    )
}