import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValidationError } from "../../../../redux/slices/userSlice";
import { EditingInfo } from "./Components/EditingInfo";
import { ShowInfo } from "./Components/ShowInfo";
import { Button } from "../../../../components/UI/Button";
import { API_URLS } from "../../../../API/api_url";
import useAuthRequest from "../../../../hooks/useAuthRequest";
import useFetchData from "../../../../hooks/useFetchData";
import * as SC from "./styles"

export const ProfileCurrentUser = () => {
    const validationError = useSelector((state) => state.user.validationError);
    const currentUser = useSelector((state) => state.user.currentUser);
    const { sendRequest } = useAuthRequest();
    const dispatch = useDispatch()
    const {fetchData} = useFetchData()

    const [editing, setEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({
        name: currentUser.name || '',
        animalType: currentUser.animalType || '',
        age: (currentUser.age || '').toString(),
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
        
        dispatch(setValidationError(''))
    };

    const handleSaveChanges = async () => {
        const isNameEmpty = editedInfo.name.trim() === '';
        const isAgeEmpty = editedInfo.age.trim() === '';
        const isGenderEmpty = editedInfo.gender.trim() === '';
        const isAnimalTypeEmpty = editedInfo.animalType.trim() === '';
        const isOtherAnimalTypeEmpty = showOtherFields.animalType.show && showOtherFields.animalType.value.trim() === '';
        const isOtherGenderEmpty = showOtherFields.gender.show && showOtherFields.gender.value.trim() === '';
        
        if (isNameEmpty || isAgeEmpty || isGenderEmpty || isAnimalTypeEmpty || isOtherAnimalTypeEmpty || isOtherGenderEmpty) {
            dispatch(setValidationError('Пожалуйста, заполните все поля перед сохранением'));
            return;
        }
        
        const updatedInfo = {
            ...editedInfo,
            animalType: showOtherFields.animalType.show ? showOtherFields.animalType.value : editedInfo.animalType,
            gender: showOtherFields.gender.show ? showOtherFields.gender.value : editedInfo.gender,
        };
        
        try {
            await sendRequest(API_URLS.updateCurrentUser, 'PUT', updatedInfo);
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
                <ShowInfo user={currentUser}>
                    <Button onClick={handleEditToggle}>Редактировать</Button>
                </ShowInfo>
            }
        </SC.Profile>
    )
}