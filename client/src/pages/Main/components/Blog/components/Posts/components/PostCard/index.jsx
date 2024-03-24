import React from "react";
import { useSelector } from "react-redux";

export const PostCard = ({ setEditPost, deletePost, user }) => {
    const currentUser = useSelector((state) => state.user.currentUser);

    let displayedPosts = [];
    const isFriend = user && currentUser.friends ? currentUser.friends.includes(user._id) : false;

    if (user == null) {
        displayedPosts = [...currentUser.posts]; 
    } else if (typeof user === 'object' && Object.keys(user).length > 0) {
        displayedPosts = isFriend ? [...user.posts] : [...user.posts.filter(post => post.visibility === "Others")]
    }

    displayedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
                            <div>
                                <button>like</button>
                                <button>Dislike</button>
                                <button>Share</button>
                            </div>
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


        
