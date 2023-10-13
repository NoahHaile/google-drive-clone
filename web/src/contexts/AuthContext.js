import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout(){
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password)

  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        setLoading(false);
        
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
