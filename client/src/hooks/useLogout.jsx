import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthRequest } from './useAuthRequest';
import { logoutUser } from '../redux/slices/userSlice';
import { API_URLS } from '../API/api_url';
import { useCallback } from 'react';

const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useAuthRequest();

    const userLogout = useCallback(async () => {
        try {
            await sendRequest(API_URLS.logout, 'GET');
            dispatch(logoutUser());
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Ошибка при выходе со страницы:', error);
        }
    });

    return { userLogout };
};

export default useLogout;