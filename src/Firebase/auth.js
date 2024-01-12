import app from "./getapp.js";

import { getAuth, 
    signInWithEmailAndPassword, 
    setPersistence, 
    browserSessionPersistence,
    signOut   } from "firebase/auth";

export const auth = getAuth(app);

export function login(email, password){
   
    setPersistence(auth, browserSessionPersistence)
    .then(() => {
        signInWithEmailAndPassword(auth, email, password)
    })
    .catch((error) => {
        console.log(error.message)
        alert(error.message)
    });
}

export function signout(){
    signOut(auth)
}
