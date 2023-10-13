import React from 'react'
import Signup from './Authentication/signup';
import "./app.css";
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Profile from './Authentication/profile';
import Login from './Authentication/login';
import PrivateRoute from './Authentication/privateRoute';
import ForgotPassword from './Authentication/forgotPassword';
import UpdateProfile from './Authentication/updateProfile';
import CenteredContainer from './Authentication/centeredContainer';
import Dashboard from './Drive/dashboard';

function App(){
    return (
        
                
                    <Router>
                        <AuthProvider>
                            <Routes>
                                <Route
                                    path="/"
                                    element={<PrivateRoute loggedIn={Dashboard} loggedOut={Login} />}
                                />
                                <Route
                                    path="/user"
                                    element={<PrivateRoute loggedIn={Profile} loggedOut={Login} />}
                                />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route
                                    path="/update-profile"
                                    element={<PrivateRoute loggedIn={UpdateProfile} loggedOut={Login} />}
                                />
                                
                            </Routes>
                        </AuthProvider>
                        
                    </Router>
               
            
        
    )
}

export default App;