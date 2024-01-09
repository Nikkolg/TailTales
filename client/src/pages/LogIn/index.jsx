import React, { useState } from 'react'
import useAuthRequest from '../../hooks/useAuthRequest';

export const LogIn = () => {
  const { sendRequest, setError } = useAuthRequest();
  const [formData, setFormData] = useState({email: '', password: ''})
  const [loginError, setLoginError] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null)
    setLoginError(null)
    try {
      const res = await sendRequest('http://localhost:3008/auth', 'POST', formData);

      if (res && res.token) {
        console.log('Добро пожаловать');
      } else {
        setLoginError('Неверный логин или пароль');
      }
      
    } catch (error) {
      console.error('Ошибка при авторизации', error);
    }
  }

  return (
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
        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}

    </form>
  )
}
