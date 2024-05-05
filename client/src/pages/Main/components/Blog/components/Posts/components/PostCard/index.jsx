import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAuthRequest from "../../../../../../../../hooks/useAuthRequest";
import { API_URLS } from "../../../../../../../../API/api_url";
import useFetchData from "../../../../../../../../hooks/useFetchData";

export const PostCard = ({ setEditPost, deletePost, user }) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const { sendRequest } = useAuthRequest();
    const { fetchData } = useFetchData();
    const [likedPosts, setLikedPosts] = useState({});
    const [dislikedPosts, setDislikedPosts] = useState({});

    let displayedPosts = [];
    const isFriend = user && currentUser.friends ? currentUser.friends.includes(user._id) : false;

    if (user == null) {
        displayedPosts = [...currentUser.posts]; 
    } else if (typeof user === 'object' && Object.keys(user).length > 0) {
        displayedPosts = isFriend ? [...user.posts] : [...user.posts.filter(post => post.visibility === "Others")]
    }

    displayedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    useEffect(() => {
        const updateLikes = {};
        const updateDislikes = {};
    
        if (user && user.posts) {
            user.posts.forEach((post) => {
                if (post && post.likes) {
                    updateLikes[post._id] = post.likes.includes(currentUser._id);
                }
                if (post && post.dislikes) {
                    updateDislikes[post._id] = post.dislikes.includes(currentUser._id);
                }
            });
        }
    
        setLikedPosts(updateLikes);
        setDislikedPosts(updateDislikes);
    }, [user, currentUser._id]);

    const handleLike = async (postId) => {
        const isAlreadyLiked = likedPosts[postId];
        const isAlreadyDisliked = dislikedPosts[postId];

        if (isAlreadyDisliked) {
            console.error("Нельзя поставить 'Like', так как у поста уже есть 'Dislike'");
            return;
        }

        try {
            const response = await sendRequest(API_URLS.like, 'POST', {
                postId,
                userId: currentUser._id,
            });

            if (response && response.message) {
                setLikedPosts((prevLikes) => ({
                    ...prevLikes,
                    [postId]: !isAlreadyLiked,
                }));
            }

            fetchData();
            console.log(user.posts);
        } catch (error) {
            console.error("Ошибка при отправке лайка:", error);
        }
    };

    const handleDislike = async (postId) => {

        const isAlreadyDisliked = dislikedPosts[postId];
        const isAlreadyLiked = likedPosts[postId];

        if (isAlreadyLiked) {
            console.error("Нельзя поставить 'Dislike', так как у поста уже есть 'Like'");
            return;
        }

        try {
            const response = await sendRequest(API_URLS.dislike, 'POST', {
                postId,
                userId: currentUser._id,
            });

            if (response && response.message) {
                setDislikedPosts((prevDislikes) => ({
                    ...prevDislikes,
                    [postId]: !isAlreadyDisliked,
                }));
            }

            fetchData();
            console.log(user.posts);

        } catch (error) {
            console.error("Ошибка при отправке дислайка:", error);
        }
    };

    return (
        <>
            {displayedPosts.map(post => (
                <div key={post._id}>
                    <div>
                        <div>Avatar</div>
                    </div>
                    <div>
                        <div>
                            <div>{new Date(post.createdAt).toLocaleString()}</div>
                            <div>
                                {post.visibility === 'Friends' ? (
                                    <p>Для друзей</p>
                                ) : (
                                    <p>Общедоступный</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h2>{post.title}</h2>
                            <p>{post.text}</p>
                        </div>
                        <div>
                            {user !== null && (
                                <div>
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        disabled={dislikedPosts[post._id]}
                                    >
                                        {likedPosts[post._id] ? 'Unlike' : 'Like'}
                                    </button>
                                    <button
                                        onClick={() => handleDislike(post._id)}
                                        disabled={likedPosts[post._id]}
                                    >
                                        {dislikedPosts[post._id] ? 'Remove Dislike' : 'Dislike'}
                                    </button>
                                    <button onClick={() => console.log('Не работает :)')}>Share</button>
                            </div>
                            )}
                            {user == null && (
                                <div>
                                    <button onClick={() => setEditPost(post)}>Редактировать</button>
                                    <button onClick={() => deletePost(post._id)}>Удалить</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};