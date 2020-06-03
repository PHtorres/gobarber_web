import React, {useCallback} from 'react';
import Button from '../../components/button';
import {useAuth} from '../../hooks/Auth';

const Dashboard: React.FC = () => {

    const {signOut} = useAuth();

    const LogOut = useCallback(()=>{
        signOut();
    }, [signOut])

    return (
        <div>
            <h1>Hello Dashbord</h1>
            <Button type="button" title="Logout" onClick={LogOut}>Logout</Button>
        </div>
    )
}

export default Dashboard;