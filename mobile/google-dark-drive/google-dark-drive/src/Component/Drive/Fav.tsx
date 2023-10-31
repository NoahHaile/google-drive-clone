import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '../../Contexts/AuthContext';
import Folder from './Folder';
import File from './File';
import AddFolderButton from './AddFolderButton';
import { useFolder } from '../../Hooks/useFolder';
import AddFileButton from './AddFileButton';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import { database } from '../../Firebase';
import { getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

export default function Fav({ navigation }: any) {
    const {currentUser} = useAuth();
    const [childFiles, setChildFiles] = useState([])
    const [userDocument, setUserDocument] = useState(null);
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        const childFilesQuery = query(
          database.files,
          where("fav", "==", true),
          where("userId", "==", currentUser.uid)
        );
    
        getDocs(childFilesQuery)
            .then((querySnapshot) => {
                // Iterate through the matching documents
                querySnapshot.forEach((doc) => {
                    const filesData = doc.data();
                    filesData.id = doc.id;
                    setChildFiles([...childFiles, filesData]);
                });
            })
            .catch((error) => {
                console.error("Error querying Firestore:", error);
            });
    
        
      }, [currentUser.uid]);

    useEffect(() => {
      const childUserImageQuery = query(
        database.users,
        where("userId", "==", currentUser.uid),
        where("deleted", "==", false)

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
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} />
          {userDocument ? (
            <Image
              source={{ uri: userDocument.photo }}
              style={styles.userPhoto}
            />
          ) : (
            <Text>No user photo available</Text>
          )}
        </View>
  
        <ScrollView style={styles.contentContainer}>
          
          <Button title='Back to Root' onPress={() => navigation.navigate('Dashboard', {folderId: null,})} />
  
          {childFiles.length > 0 && (
            <View style={styles.fileContainer}>
              {childFiles.map((childFile) => (
                <File file={childFile} key={childFile.id} onDelete={setRefresh} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1a1a1a', // Dark background color
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    contentContainer: {
      paddingHorizontal: 20,
    },
    folderContainer: {
      marginTop: 20,
    },
    fileContainer: {
      marginTop: 20,
    },
    userPhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
  });

