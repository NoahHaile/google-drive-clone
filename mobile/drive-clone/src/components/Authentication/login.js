import React, { useRef, useState } from 'react';

import { useAuth } from '../../Contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const { login, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setError('');
        setLoading(true);
      await login(email, password);
      navigate.navigate('Dashboard');
      // Redirect to the dashboard or perform other actions after successful signup.
    } catch (error) {
      // Handle signup error, e.g., display an error message.
      console.error('Failed to sign in');
    }
    setLoading(false);
  };

  return (
    <View>
      <Text>Login Screen</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
