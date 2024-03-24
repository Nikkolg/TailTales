import React from "react";
import { Link } from "react-router-dom";
import * as SC from "./styles"

export const ProfileCard = ({children, user}) => (
    <Link to={`/user/${user._id}`}>
        <SC.FriendsCard key={user._id}>
            <SC.RibbonFriendsAvatar>Avatar</SC.RibbonFriendsAvatar>
            <p>{user.name}</p>
            {children}
        </SC.FriendsCard>
    </Link>
)