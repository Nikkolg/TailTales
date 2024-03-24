import React, { useState } from "react";
import { PostCard } from './components/PostCard'
import { EditPostCard } from './components/EditPostCard'
import { API_URLS } from "../../../../../../API/api_url";
import { useSelector } from "react-redux";
import useFetchData from "../../../../../../hooks/useFetchData";

export const Posts = ({handlePostOperation}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [editPost, setEditPost] = useState(null)
    const {fetchData} = useFetchData()

    const deletePost = async (postId) => {
        try {
            await handlePostOperation(API_URLS.deletePost, "POST", {postId});
            fetchData()
        } catch (error) {
            console.error('Ошибка при удалении поста на сервере', error);
        }
    }

    return (
        <div>
            {currentUser.posts && currentUser.posts.length > 0 ? (
                <>
                    {!editPost ? (
                        <PostCard 
                            user={null}
                            setEditPost={setEditPost}
                            deletePost={deletePost}
                        />
                    ) : (
                        <EditPostCard 
                            editPost={editPost}
                            setEditPost={setEditPost}
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