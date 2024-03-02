import {React, useState} from "react"
import { login, auth } from "../Firebase/auth.js"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {
    Authenticator,
    Button,
    Heading,
    Image,
    View,
    Card,
} from "@aws-amplify/ui-react";
import AdminLeagues from "./listAdminLeagues.js";

export default function LoginPage(){
    return (
        <Authenticator>
        {({ signOut, user }) => (
            <View className="App">
            <Card>
                <Heading level={1}>We now have Auth!</Heading>
                <h1>Hello {user.username}</h1>
                <AdminLeagues adminuid={user.userId}/>
            </Card>
            <Button onClick={signOut}>Sign Out</Button>
            </View>
        )}
        
        </Authenticator>
    )
}