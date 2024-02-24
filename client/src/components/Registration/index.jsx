import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import useAuthRequest from '../../hooks/useAuthRequest';
import { Form } from '../UI/Form';
import { Input } from '../UI/Input';
import { Dropdown } from '../UI/Select';
import { InputRadio } from '../UI/InputRadio';
import { Button } from '../UI/Button';

export const Registration = () => {
  const { register, setError } = useAuthRequest();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    animalType: 'Dog',
    age: '',
    gender: '',
  });

  const animalTypeOptions = ['Dog', 'Cat', 'Fish', 'Bird', 'Reptile', 'Other'];
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const navigate = useNavigate()

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
        console.log(res);
        if (res && res.message) {
            console.log('Регистрация успешна');
            navigate('/')
        } else {
            console.error('Ошибка при регистрации:', res);
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
    }
};

  return (
    <>
      <Form onSubmit={handleSubmit}>

        <Input 
          type='text' 
          name='name' 
          placeholder='Name' 
          onChange={handleChange} 
        />

        <Input 
          type='email' 
          name='email' 
          placeholder='Email' 
          onChange={handleChange} 
        />

        <Input 
          type='password' 
          name='password' 
          placeholder='Password' 
          onChange={handleChange} 
        />

        <Dropdown 
          name='animalType' 
          options={animalTypeOptions} 
          onChange={handleChange} 
        />

        <Input 
          type='text' 
          name='age' 
          placeholder='Age' 
          onChange={handleChange} 
        />

        <InputRadio
          name='gender' 
          options={genderOptions} 
          onChange={handleChange}
          text='Выберите пол' 
        />

        <Input type='submit' value='Отправить' />
      </Form>
      <Button><Link to="/">На главную</Link></Button>
    </>
  );
};
