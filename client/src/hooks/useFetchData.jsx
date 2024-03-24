import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useAuthRequest from './useAuthRequest';
import { setAllUsers, setCurrentUser } from '../redux/slices/userSlice';
import { API_URLS } from '../API/api_url';

const useFetchData = () => {
    const dispatch = useDispatch();
    const { sendRequest } = useAuthRequest();

    const fetchData = useCallback(async () => {
        try {
            const resCurrentUser = await sendRequest(API_URLS.currentUser, 'GET');
            const resAllUsers = await sendRequest(API_URLS.allUsers, 'GET');

            if (resCurrentUser && resCurrentUser.user) {
                dispatch(setCurrentUser(resCurrentUser.user));
            }

            if (resAllUsers && resAllUsers.users) {
                dispatch(setAllUsers(resAllUsers.users));
            }
        } catch (error) {
            console.error('Ошибка при получении данных', error);
        }
    }, [dispatch, sendRequest]); 

    return {fetchData};
};

export default useFetchData;

