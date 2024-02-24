import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useAuthRequest from "../../../../hooks/useAuthRequest";
import { setCurrentUser } from "../../../../redux/slices/userSlice";
import { EditingInfo } from "./Components/EditingInfo";
import { ShowInfo } from "./Components/ShowInfo";
import * as SC from "./styles"

export const ProfileCurrentUser = ({validationError, setValidationError, fetchData, currentUser}) => {

    const { sendRequest } = useAuthRequest();
    const dispatch = useDispatch()

    const [editing, setEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({
        name: currentUser.name || '',
        animalType: currentUser.animalType || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
    });
    const [showOtherFields, setShowOtherFields] = useState({
        animalType: {
            show: false,
            value: '',
        },
        gender: {
            show: false,
            value: '',
        },
    });
    const animalTypeOptions = ['Dog', 'Cat', 'Fish', 'Bird', 'Reptile', 'Other'];
    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'animalType' || name === 'gender') {
            setShowOtherFields((prevFields) => ({
                ...prevFields,
                [name]: {
                    ...prevFields[name],
                    show: value === 'Other',
                },
            }));
        }
        
        setEditedInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        
        setValidationError('');
    };

    const handleSaveChanges = async () => {
        const isNameEmpty = editedInfo.name.trim() === '';
        const isAgeEmpty = editedInfo.age.trim() === '';
        const isGenderEmpty = editedInfo.gender.trim() === '';
        const isAnimalTypeEmpty = editedInfo.animalType.trim() === '';
        const isOtherAnimalTypeEmpty = showOtherFields.animalType.show && showOtherFields.animalType.value.trim() === '';
        const isOtherGenderEmpty = showOtherFields.gender.show && showOtherFields.gender.value.trim() === '';
        
        if (isNameEmpty || isAgeEmpty || isGenderEmpty || isAnimalTypeEmpty || isOtherAnimalTypeEmpty || isOtherGenderEmpty) {
            setValidationError('Пожалуйста, заполните все поля перед сохранением.');
            return;
        }
        
        const updatedInfo = {
            ...editedInfo,
            animalType: showOtherFields.animalType.show ? showOtherFields.animalType.value : editedInfo.animalType,
            gender: showOtherFields.gender.show ? showOtherFields.gender.value : editedInfo.gender,
        };
        
        try {
            await sendRequest('http://localhost:3008/updateCurrentUser', 'PUT', updatedInfo);
            dispatch(setCurrentUser(updatedInfo));
            fetchData();
            setEditing(false);
        } catch (error) {
            console.error('Ошибка при обновлении данных на сервере', error);
        }
    };

    const handleCancelChanges = () => {
        setEditedInfo({
            name: currentUser.name || '',
            animalType: currentUser.animalType || '',
            age: currentUser.age || '',
            gender: currentUser.gender || '',
        });
        setShowOtherFields({
            animalType: {
                show: false,
                value: '',
            },
            gender: {
                show: false,
                value: '',
            },
        });
        setEditing(false);
    };

    const handleEditToggle = () => {
        setEditing(!editing);
    };


    return (
        <SC.Profile>
            <SC.AvatarCurrentUser>
                Avatar
            </SC.AvatarCurrentUser>
            <SC.InfoCurrentUser>
                {editing ? 
                    <EditingInfo 
                        editedInfo={editedInfo}
                        handleInputChange={handleInputChange}
                        animalTypeOptions={animalTypeOptions}
                        showOtherFields={showOtherFields}
                        setShowOtherFields={setShowOtherFields}
                        genderOptions={genderOptions}
                        handleSaveChanges={handleSaveChanges}
                        validationError={validationError}
                        handleCancelChanges={handleCancelChanges}
                    /> : 
                    <ShowInfo 
                        currentUser={currentUser}
                        handleEditToggle={handleEditToggle}
                    />
                }
            </SC.InfoCurrentUser>
        </SC.Profile>
    )
}