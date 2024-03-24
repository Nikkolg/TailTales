import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import useAuthRequest from '../../hooks/useAuthRequest';
import { Input } from '../UI/Input'
import { Button } from '../UI/Button'
import { ErrorDisplay } from '../UI/ErrorDisplay'
import { Form } from '../UI/Form'
import { API_URLS } from '../../API/api_url';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../redux/slices/userSlice';

export const LogIn = () => {
  const { sendRequest, setError } = useAuthRequest();
  const [formData, setFormData] = useState({email: '', password: ''})
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoginError(null);

    try {
        const res = await sendRequest(API_URLS.login, 'POST', formData);
        localStorage.setItem('token', res.token);
        dispatch(setCurrentUser(res.user))
        navigate('/main');
        
    } catch (error) {
        console.error('Ошибка при авторизации', error);
        setLoginError('Неверный логин или пароль');
    }
  }

  return (
    <>
      <Form onSubmit={handleLogin}>
          <Input 
            type='email' 
            placeholder='email' 
            name='email'
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <br />
          <Input 
            type='password' 
            placeholder='password' 
            name='password'
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <br />
          <Button type='submit'>Войти</Button>
          <br />
      </Form>
      <Button><Link to="/registration">Перейти к регистрации</Link></Button>
      <ErrorDisplay error={loginError} />
    </>
  )
}
