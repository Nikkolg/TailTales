import React from "react";
import { Button } from "../UI/Button";
import * as SC from "./styles"

export const ProfileCard = ({handleAction, children, user}) => (
    <SC.FriendsCard key={user._id}>
        <SC.RibbonFriendsAvatar>Avatar</SC.RibbonFriendsAvatar>
        <p>{user.name}</p>
        <Button onClick={() => handleAction(user._id)}>{children}</Button>
    </SC.FriendsCard>
)