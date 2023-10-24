import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


export default function PrivateRoute({ loggedIn: LoggedInComponent, loggedOut: LoggedOutComponent }) {
    const { currentUser } = useAuth();
  
    return currentUser ? <LoggedInComponent /> : <LoggedOutComponent />;
  }
