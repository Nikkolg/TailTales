import React from "react";

export const Dropdown = ({ name, options, onChange }) => (
    <select name={name} onChange={onChange}>
        <option value="">--Пожалуйста выберите из списка--</option>
        {options.map((option, index) => (
            <option key={index}>{option}</option>
        ))}
    </select>
);
