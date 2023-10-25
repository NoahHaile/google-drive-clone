import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Component/Authentication/Login';
import Signup from './src/Component/Authentication/Signup';
import Dashboard from './src/Component/Drive/Dashboard';
import { AuthProvider } from './src/Contexts/AuthContext';
import ForgotPassword from './src/Component/Authentication/ForgotPassword';
import Profile from './src/Component/Authentication/Profile';
import UpdateProfile from './src/Component/Authentication/UpdateProfile';
import Trash from './src/Component/Drive/Trash';
import Fav from './src/Component/Drive/Fav';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();
export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../../assets/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../../assets/Roboto-Bold.ttf'),
    'Roboto-Italic': require('../../assets/Roboto-Italic.ttf'),
    'Roboto-BoldItalic': require('../../assets/Roboto-BoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return <></>;
  }
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">      
          <Stack.Screen name="Login" component={Login} 
            options={{
              title: 'Log In',
              headerStyle: {
                backgroundColor: '#555',
                
              },
              headerTitleStyle: {
                fontSize: 20,
                color: 'white',
              },
              headerTintColor: 'white',
              headerBackTitle: 'Back',
              animationTypeForReplace: 'push',
              animation:'slide_from_right'
            }}/>
          <Stack.Screen name="Signup" component={Signup}
            options={{
              title: 'Sign up',
              headerStyle: {
                backgroundColor: '#555',
                
              },
              headerTitleStyle: {
                fontSize: 20,
                color: 'white',
              },
              headerTintColor: 'white',
              headerBackTitle: 'Back',
              animationTypeForReplace: 'push',
              animation:'slide_from_right'
            }}/>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{
              title: 'Dashboard',
              headerStyle: {
                backgroundColor: '#000',
                
              },
              headerTitleStyle: {
                fontSize: 20,
                color: 'white',
              },
              headerTintColor: 'white',
              headerBackTitle: 'Back',
              animationTypeForReplace: 'push',
              animation:'slide_from_right'
            }} />
          <Stack.Screen name="Trash" component={Trash} />
          <Stack.Screen name="Fav" component={Fav} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Forgot-Password" component={ForgotPassword} />
          <Stack.Screen name="Update-Profile" component={UpdateProfile} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
<Route
                                    path="/"
                                    element={<PrivateRoute loggedIn={Dashboard} loggedOut={Login} />}
                                />
                                <Route path="/folder/:folderId" element={<Dashboard />} />
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

*/
