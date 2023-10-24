import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../Contexts/AuthContext';
import Login from './Authentication/login';
import Test1 from './Test1';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Test"
            component={Test1}
          />
        </Stack.Navigator>
      </AuthProvider>
      
    </NavigationContainer>
  );
}

export default App;
