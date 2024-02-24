import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PostCard } from './components/PostCard'
import { EditPostCard } from './components/EditPostCard'

export const Posts = ({handlePostOperation, setValidationError, validationError}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [editPost, setEditPost] = useState(null)

    const deletePost = async (postId) => {
        try {
            await handlePostOperation('http://localhost:3008/deletePost', "POST", {postId});
        } catch (error) {
            console.error('Ошибка при удалении поста на сервере', error);
        }
    }

    return (
        <div>
            {currentUser.posts && currentUser.posts.length > 0 ? (
                <>
                    {!editPost ? (
                        <>
                            {currentUser.posts.map((post) => (
                                <PostCard 
                                    key={post._id} 
                                    post={post} 
                                    setEditPost={setEditPost}
                                    deletePost={deletePost}
                                />
                            ))}
                        </>
                    ) : (
                        <EditPostCard 
                            editPost={editPost}
                            setEditPost={setEditPost}
                            setValidationError={setValidationError}
                            validationError={validationError}
                            handlePostOperation={handlePostOperation}
                        />
                    )}
                </>
            ) : (
                <h2>Нет постов</h2>
            )}
        </div>
    )
}