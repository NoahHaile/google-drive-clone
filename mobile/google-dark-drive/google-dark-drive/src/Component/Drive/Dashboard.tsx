import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, ScrollView, Image, ImageBackground, Animated, Easing } from 'react-native';
import { useAuth } from '../../Contexts/AuthContext';
import Folder from './Folder';
import File from './File';
import AddFolderButton from './AddFolderButton';
import { useFolder } from '../../Hooks/useFolder';
import AddFileButton from './AddFileButton';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import { database } from '../../Firebase';
import { onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';

export default function Dashboard({ navigation, route }: any) {
    const {currentUser} = useAuth();
    const { folderId } = route.params;
    
    const { folder, childFolders, childFiles } = useFolder(folderId);
    const [userDocument, setUserDocument] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [translateXAnim, setTranslateXAnim] = useState(new Animated.Value(-100)); // Initial position to the left
    
    const slideInForm = () => {
      Animated.timing(translateXAnim, {
        toValue: 0, // Slide to the original position
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    };
    

    useEffect(() => {
      slideInForm();
      const childUserImageQuery = query(
        database.users,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"), // Sort by createdAt in descending order to get the latest image
        limit(1)
      );
    
    const unsubscribe = onSnapshot(childUserImageQuery, (snapshot) => {
      // Assuming you want to retrieve the first document that matches the query
      if (snapshot.docs.length > 0) {
        const userDocument = snapshot.docs[0].data();
        setUserDocument(userDocument);
        
        // Now, you have the user document that matches the query
        // You can update your state or perform any other operations here
        console.log("User document:", userDocument);
      }
    });
  
    // Return a cleanup function to unsubscribe from the snapshot
    return () => unsubscribe();
  }, [currentUser.uid]);
    return (
      <ImageBackground
        source={require('../../../assets/leaves.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Animated.Text style={[styles.title2, { transform: [{ translateX: translateXAnim }]}]}>
            Google <Text style={styles.darkText}> Dark </Text> Drive
            </Animated.Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              {userDocument ? (
                <Image
                  source={{ uri: userDocument.url }}
                  style={styles.userPhoto}
                />
              ) : (
                <Image
                source={require('../../../assets/AnonPhoto.png')}
                  style={styles.userPhoto}
                />
              )}
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.nav}>
              
              <FolderBreadcrumbs currentFolder={folder} navigation={navigation} />
              
              <TouchableOpacity style={styles.trash} onPress={() => navigation.navigate('Trash') }>
                <Text style={styles.trashText}>Trash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fav} onPress={() => navigation.navigate('Fav') }>
                <Text style={styles.favText}>Favorites</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.nav2}>
                
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} /> 
            </View>
            
          </View>
          <ScrollView style={styles.contentContainer}>
            <View style={styles.folderFileContainer}>
              {childFolders.length > 0 && (
                <>
                  {childFolders.map((childFolder) => (
                    <View style={styles.folderFile}>
                      <Folder  folder={childFolder} key={childFolder.id} navigation={navigation}  />
                    </View>
                  ))}
                </>
                
              )}
      
              {childFiles.length > 0 && (
                <>
                  {childFiles.map((childFile) => (
                    <View style={styles.folderFile}>
                      <File file={childFile} key={childFile.id} onDelete={setRefresh} />
                    </View>
                  ))}
                </>
              )}
            </View>
          </ScrollView>
        </View>
        </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    greeting: {
      fontFamily: 'Roboto-Italic',
      fontSize: 16,
      color: 'white',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      
    },
    title2: {
      fontFamily: 'Roboto-BoldItalic',
      fontSize: 25,
      color: '#000', // Subheader color (a shade of light blue)
      backgroundColor: 'lightblue', // Background color
      textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow color
      textShadowOffset: { width: 2, height: 2 }, // Text shadow offset
      textShadowRadius: 5, // Text shadow radius
      borderWidth: 1, // Border width
      borderColor: 'lightblue', // Border color
      borderRadius: 50,
    },
    darkText: {
      fontFamily: 'Roboto-BoldItalic',
      fontSize: 25,
      color: '#fff', // Subheader color (a shade of light blue)
      backgroundColor: '#4f0903', // Background color
      textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow color
      textShadowOffset: { width: 2, height: 2 }, // Text shadow offset
      textShadowRadius: 5, // Text shadow radius
      borderWidth: 1, // Border width
      borderColor: 'lightyellow', // Border color
      borderRadius: 50,
      
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    nav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 0,
      margin: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    nav2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 10,
      margin: 0,
      backgroundColor: 'rgba(242, 203, 165, 1)',
    },
    contentContainer: {
      paddingHorizontal: 20,
      backgroundColor: 'rgba(242, 203, 165, 1)',
    },
    folderFileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 5,
      
      flexWrap: 'wrap',
    },
    folderFile: {
      margin: 10,
    },
    userPhoto: {
      width: 40,
      height: 40,
      borderRadius: 50,
    },
    trash: {
      backgroundColor: '#000', // Background color
      padding: 8,
      width: '15%', // Adjust the width as needed
      alignItems: 'center', // Center the button horizontally
      borderRightWidth: 1, // Border width
      borderColor: 'white', // Border color
      borderStyle: 'solid',
    },
    fav: {
      backgroundColor: '#fff', // Background color
      padding: 8, // Padding to make it bigger
      width: '25%', // Adjust the width as needed
      alignItems: 'center', // Center the button horizontally
      borderLeftWidth: 1,
      borderColor: 'white', // Border color
      borderStyle: 'solid',
    },
    trashText:
    {
      fontFamily: 'Roboto-Bold',
      color: 'white',
      fontSize: 13,
    },
    favText:
    {
      fontFamily: 'Roboto-Bold',
      color: 'black',
      fontSize: 13,
    },
  });

