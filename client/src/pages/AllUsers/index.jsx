import React, { useEffect, useState } from 'react'
import { Container } from '../../components/UI/Container'
import { Header } from '../../components/Header'
import { Button } from '../../components/UI/Button'
import useLogout from '../../hooks/useLogout'
import {Search} from './components/Search'
import { useSelector } from 'react-redux'
import useFetchData from '../../hooks/useFetchData'
import { FriendsPanel } from '../../components/FriendsPanel'
import { Link } from 'react-router-dom'

export const AllUsers = () => {
    const [searchUsers, setSearchUsers] = useState('')
    const { userLogout } = useLogout();
    const { fetchData } = useFetchData();

    const allUsers = useSelector((state) => state.user.allUsers);
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <Header>
                <Button><Link to='/main'>На главную</Link></Button>  
                <Button onClick={userLogout}>Выход</Button>
            </Header>

            <div>
                <Search 
                    setSearchUsers={setSearchUsers}
                />

                <FriendsPanel 
                    users={allUsers}
                    currentUser={currentUser}
                    searchUsers={searchUsers}
                />
            </div>
        </Container>
    )
}
