import React from "react";
import { Input } from "../../../../../../components/UI/Input";
import { Dropdown } from "../../../../../../components/UI/Select";
import { Button } from "../../../../../../components/UI/Button";
import { ErrorDisplay } from "../../../../../../components/UI/ErrorDisplay";
import { InputRadio } from "../../../../../../components/UI/InputRadio";

export const EditingInfo = ({
        editedInfo, 
        handleInputChange, 
        animalTypeOptions,
        showOtherFields,
        setShowOtherFields,
        genderOptions,
        handleSaveChanges,
        validationError,
        handleCancelChanges
    }) => (
    <>
        <Input
            type="text"
            name="name"
            placeholder='name'
            value={editedInfo.name}
            onChange={handleInputChange}
        />

        <Dropdown 
            name='animalType'
            options={animalTypeOptions}
            onChange={handleInputChange}
        />

        {showOtherFields.animalType.show && (
            <Input
                type="text"
                name="otherAnimalType"
                placeholder="animalType"
                value={showOtherFields.animalType.value}
                onChange={(e) => setShowOtherFields((prevFields) => ({
                ...prevFields,
                animalType: {
                    ...prevFields.animalType,
                    value: e.target.value,
                },
                }))}
            />
        )}

        <Input
            type="text"
            name="age"
            placeholder='age'
            value={editedInfo.age}
            onChange={handleInputChange}
        />

        <InputRadio
            name="gender"
            options={genderOptions}
            onChange={handleInputChange}
        />

        {showOtherFields.gender.show && (
            <Input
                type="text"
                name="otherGender"
                placeholder="gender"
                value={showOtherFields.gender.value}
                onChange={(e) => setShowOtherFields((prevFields) => ({
                    ...prevFields,
                    gender: {
                        ...prevFields.gender,
                        value: e.target.value,
                    },
                }))}
            />
        )}

        <Button onClick={handleSaveChanges}>Сохранить</Button>
        <Button onClick={handleCancelChanges}>Отмена</Button>

        <ErrorDisplay error={validationError} />
    </>
)