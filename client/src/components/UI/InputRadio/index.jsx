import React from "react";

export const InputRadio = ({name, options, onChange, text}) => (
    <fieldset>
        <legend>{text}</legend>
        {options.map((option, index) => (
            <label key={index}>
                <input 
                    type='radio' 
                    name={name} 
                    value={option.value} 
                    onChange={onChange} 
                />
                {option.label}
            </label>
        ))}
    </fieldset>
)

