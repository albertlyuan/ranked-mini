import { useNavigate, useParams } from 'react-router-dom'
import { signout } from '../Firebase/auth.js';

export default function Logout(){
    const navigate = useNavigate();
    const {leagueid} = useParams()
    function handleLogout(){
        signout()
        navigate(`/${leagueid}`)
    }
    
    return (
        <a className="clickable" onClick={handleLogout}>Log out</a> 
    )
}