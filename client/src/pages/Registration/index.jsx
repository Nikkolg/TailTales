import React, { useState } from 'react'
import useAuthRequest from '../../hooks/useAuthRequest';

export const Registration = () => {
  const { register, setError } = useAuthRequest();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    animalType: '',
    age: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const res = await register('http://localhost:3008/registration', formData);
        if (res && res.message) {
            console.log('Регистрация успешна');
        } else {
            console.error('Ошибка при регистрации:', res);
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
    }
};

console.log(formData);
  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='name' placeholder='Name' onChange={handleChange} />
      <input type='email' name='email' placeholder='Email' onChange={handleChange} />
      <input type='password' name='password' placeholder='Password' onChange={handleChange} />
      <select name='animalType' onChange={handleChange}>
        <option>Dog</option>
        <option>Cat</option>
        <option>Fish</option>
        <option>Bird</option>
        <option>Reptile</option>
        <option>Other</option>
      </select>
      <input type='text' name='age' placeholder='Age' onChange={handleChange} />
      <fieldset>
        <legend>Выберите пол</legend>
        <label><input type='radio' name='gender' value='Male' onChange={handleChange} /> Men</label>
        <label><input type='radio' name='gender' value='Female' onChange={handleChange} /> Women</label>
        <label><input type='radio' name='gender' value='Other' onChange={handleChange} /> Other</label>
      </fieldset>
      <input type='submit' value='Отправить' />
    </form>
  );
};
