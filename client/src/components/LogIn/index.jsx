import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAuthRequest from '../../hooks/useAuthRequest';
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
        const res = await sendRequest('http://localhost:3008/', 'POST', formData);
        if (res && res.user) {
          dispatch(setCurrentUser(res.user))
            navigate('/main');
        } else {
            setLoginError('Неверный логин или пароль');
        }
    } catch (error) {
        console.error('Ошибка при авторизации', error);
    }
}

  return (
    <>
      <form onSubmit={handleLogin}>
          <input 
            type='email' 
            placeholder='email' 
            name='email'
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <br />
          <input 
            type='password' 
            placeholder='password' 
            name='passsword'
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <br />
          <button type='submit'>Войти</button>
          <br />
      </form>
      <button><Link to="/registration">Перейти к регистрации</Link></button>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
    </>
  )
}
