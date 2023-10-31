import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions } from 'react-native';
import { storage, database } from "../../Firebase";
import { Ionicons } from '@expo/vector-icons';
//import Animated, { Easing } from 'react-native-reanimated';
import { ref, deleteObject, getDownloadURL } from "firebase/storage";
import { deleteDoc, doc, getDoc, query, updateDoc, where } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
//import firebase from 'firebase/app';
import 'firebase/storage';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
//import { PermissionsAndroid, Platform } from 'react-native';
import MoveFile from "./MoveFile";

const { height } = Dimensions.get('window');

export default function File({ file, onDelete }) {

  const [open, setOpen] = useState(false)
  const [move, setMove] = useState(false)
  let newFolder: string = null;


  function setNewFolder(newId){
    newFolder = newId;
  }
  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }
  const handleDownload = async () => {
    try {
      const fileRef = doc(database.files, file.id);
      getDoc(fileRef)
        .then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const fileData = docSnapshot.data();
            const downloadFile = async (url, localFilePath) => {
              try {
                const { uri } = await FileSystem.downloadAsync(url, localFilePath);
  
                // Requesting permission
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status === 'granted') {
                  // Creating an asset and moving it to the Downloads album (or creating it if it doesn't exist)
                  const asset = await MediaLibrary.createAssetAsync(uri);
                  const album = await MediaLibrary.getAlbumAsync('Download');
                  if (album) {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                  } else {
                    await MediaLibrary.createAlbumAsync('Download', asset, false);
                  }
  
                  console.log('File downloaded and moved to the Download album:', uri);
                } else {
                  console.error('Storage permission denied');
                }
              } catch (error) {
                console.error('Error downloading the file:', error);
              }
            };
  
            const localFilePath = `${FileSystem.documentDirectory}${fileData.name}`;
            downloadFile(fileData.url, localFilePath);
          } else {
            console.log('File not found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    } catch (error) {
      console.error("Error getting download URL:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const fileRef = doc(database.files, file.id);
      getDoc(fileRef)
        .then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const fileData = docSnapshot.data();
  
            // Delete the file from Firebase Storage
            const fileStorageRef = ref(storage, fileData.url);
            //await deleteDoc(fileRef);
            await updateDoc(fileRef, {
              deleted: true,
            });
            await deleteObject(fileStorageRef);
            
            console.log('File deleted from Firebase Storage.');
            onDelete(true);
          } else {
            console.log('File not found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };

  const handleTrash = async () => {
    try {
      const fileRef = doc(database.files, file.id);
      getDoc(fileRef)
        .then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const fileData = docSnapshot.data();
  
            await updateDoc(fileRef, {
              folderId: 'trash'
            });
            onDelete(true);
          } else {
            console.log('File not found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };

  const handleFav = async () => {
    try {
      const fileRef = doc(database.files, file.id);
      getDoc(fileRef)
        .then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const fileData = docSnapshot.data();
  
            await updateDoc(fileRef, {
              fav: true
            });
            onDelete(true);
          } else {
            console.log('File not found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };
  
  const moveFile = () => {
    console.log(newFolder)
    try {
      const fileRef = doc(database.files, file.id);
      getDoc(fileRef)
        .then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const fileData = docSnapshot.data();
            
            await updateDoc(fileRef, {
              folderId: newFolder,
            });
            setNewFolder('')
            
            console.log('File deleted from Firebase Storage.');
          } else {
            console.log('File not found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  }

  const dynamicColors = ['#FF5733', '#FFC300', '#33FF57', '#0099CC']; // Define an array of dynamic colors
  const getRandomColor = () => {
    // Generate a random color from the array
    const randomIndex = Math.floor(Math.random() * dynamicColors.length);
    return dynamicColors[randomIndex];
  };
  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Image
          source={require('../../../assets/file2.png')}
          style={{ width: 80, height: 80 }}
        />
        <Text style={styles.fileName}>
          {file.name.length > 8 ? `${file.name.substring(0, 8)}...` : file.name}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.menuTitle}>File Manager</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={32} color="#AA0000" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#22AA11' }]} onPress={handleDownload}>
              <Text style={styles.modalButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF6347' }]} onPress={handleDelete}>
              <Text style={[styles.modalButtonText, { color: 'white' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleTrash}>
              <Text style={styles.modalButtonText}>Trash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#fff' }]} onPress={handleFav}>
              <Text style={[styles.modalButtonText, { color: '#000' }]}>Favorite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#4682B4' }]}
              onPress={() => {
                setOpen(false);
                setMove(true);
              }}
            >
              <Text style={[styles.modalButtonText, { color: 'white' }]}>Move</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {move && (
        <Modal visible={move} animationType="slide" transparent={true}>
          <MoveFile setDisplay={setMove} setDestination={setNewFolder} moveFile={moveFile} />
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darkened background overlay
  },
  modalContainer: {
    backgroundColor: '#333', // Dark background for the modal
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555', // Slightly lighter border color for separation
    marginBottom: 20,
  },
  fileName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: "#bbb", // Lighter text color for better contrast
    fontFamily: "Roboto-Italic"
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    borderColor: '#555', // Slightly lighter border color for buttons
    borderWidth: 1,
    backgroundColor: '#444', // Dark background for buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff', // White text color for better contrast
  },
  closeButton: {
    backgroundColor: '#222', // Even darker background for the close button
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    borderColor: '#444', // Border color for the close button
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff', // White text color for the close button text
  },
  

  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 1,
    padding: 2,
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
  menuBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '70%',
  },
  menuTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  
});
/*
<MoveFile current={file.folderId} setDestination={setNewFolder}/>
        <Button title='Move' onPress={()=> {try {
      const fileRef = doc(database.files, file.id);
      getDoc(fileRef)
        .then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const fileData = docSnapshot.data();
  
            await updateDoc(fileRef, {
              folderId: newFolder
            });
            onDelete(true);
          } else {
            console.log('File not found in Firestore.');
          }
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    } catch (error) {
      console.error('Error deleting the file:', error);
    }}} />*/
