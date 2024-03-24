import React from "react";
import * as SC from "./styles"

export const ShowInfo = ({user, children}) => (
    <>
        <SC.AvatarCurrentUser>
            Avatar
        </SC.AvatarCurrentUser>
        <SC.InfoCurrentUser>
            <h2>Name: {user.name}</h2>
            <h3>{user.animalType}</h3>
            <h3>{user.age} years</h3>
            <p>{user.gender}</p>
            <p>Location</p>
            <p>About me</p>
            {children}
        </SC.InfoCurrentUser>
    </>
)