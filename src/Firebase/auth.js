import { createLeague } from "./database.js";
import app from "./getapp.js";

import { getAuth, 
    signInWithEmailAndPassword, 
    setPersistence, 
    browserSessionPersistence,
    signOut} from "firebase/auth";

export const auth = getAuth(app);

export function login(email, password){
   
    setPersistence(auth, browserSessionPersistence)
    .then(() => {
        signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            console.log(error.message)
            alert(error.message)
        });
        // .catch((_)=>{

        //     createUserWithEmailAndPassword(auth, email, password)
        //     .then((newuser)=>{
        //         alert(newuser.user.uid)
        //         createLeague(newuser.user.uid)
        //     })
        //     .catch((error) => {
        //         console.log(error.message)
        //         alert(error.message)
        //     });
        // })
    })
    .catch((error) => {
        console.log(error.message)
        alert(error.message)
    });
}

export function signout(){
    signOut(auth)
}
