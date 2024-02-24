import React from "react";

export const ShowInfo = ({currentUser, handleEditToggle}) => (
    <>
        <h2>Name: {currentUser.name}</h2>
        <h3>{currentUser.animalType}</h3>
        <h3>{currentUser.age} years</h3>
        <p>{currentUser.gender}</p>
        <p>Location</p>
        <p>About me</p>
        <button onClick={handleEditToggle}>Редактировать</button>
    </>
)