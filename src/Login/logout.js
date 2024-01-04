import { useNavigate } from 'react-router-dom'
import { signout } from '../Firebase/auth.js';

export default function Logout({leagueid}){
    const navigate = useNavigate();
    function handleLogout(){
        signout()
        navigate(`/${leagueid}/`)
    }

    return (
        <a className="clickable" onClick={handleLogout}>Log out</a> 
    )
}