import React from "react";

export const PostCard = ({post, setEditPost, deletePost}) => (
        <div>
            <div>
                <div>Avatar</div>
            </div>
            <div>

                <div>
                    <div>{new Date(post.createdAt).toLocaleString()}</div>
                    <div>
                        {post.visibility == 'Friends' ? (
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
                    <div>
                        <button onClick={() => setEditPost(post)}>Редактировать</button>
                        <button onClick={() => deletePost(post._id)}>Удалить</button>
                    </div>
                </div>

            </div>
        </div>
    )
