import React, {useState} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { storage, database } from "../../Firebase";
import { ref, deleteObject, getDownloadURL } from "firebase/storage";
import { deleteDoc, doc, getDoc, query, updateDoc, where } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase/app';
import 'firebase/storage';
import * as Permissions from 'expo-permissions';
import { PermissionsAndroid, Platform } from 'react-native';
import MoveFile from "./MoveFile";

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
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // The 'docSnapshot' object contains the data for the document with the specified ID
          
          const fileData = docSnapshot.data();
          const downloadFile = async (url, localFilePath) => {
            try {
              // Download the file from the provided URL.
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Storage Permission',
                  message: 'App needs access to storage for file download.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
              const { uri } = await FileSystem.downloadAsync(url, localFilePath);
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const destinationFilePath = `/storage/emulated/0/Download/${fileData.name}`; // Replace with your desired location.
                await FileSystem.moveAsync({
                  from: uri, // The downloaded file's URI
                  to: destinationFilePath,
                });
              
                // Now, 'uri' contains the local path to the downloaded file on your device.
                console.log('Downloaded file location:', uri);
                console.log('Downloaded file location:', destinationFilePath);
              }
            } catch (error) {
              console.error('Error downloading the file:', error);
            }
          };
          
          // Usage: Replace 'fileUrl' with the actual URL from Firebase Storage, and 'localFilePath' with the desired local path to save the file.
          
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
      <TouchableOpacity onPress={ () => setOpen(true)}>
        <Image
                  source={require('../../../assets/file2.png')}
                  style={{width: 50, height: 50}}
              />
          <Text style={styles.fileName}>{file.name.length > 8 ? `${file.name.substring(0, 8)}...` : file.name}</Text>

      </TouchableOpacity>
      
      <Modal visible={open} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.menuBox}>
      <Text style={styles.menuTitle}>File Manager</Text>
      <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#013d04'} ]} onPress={handleDownload}>
        <Text style={[styles.modalButtonText, {color: 'white', }]}>Download</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#a80202'} ]} onPress={handleDelete}>
        <Text style={[styles.modalButtonText, {color: 'white', }]}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={handleTrash}>
        <Text style={styles.modalButtonText}>Trash</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={handleFav}>
        <Text style={styles.modalButtonText}>Favorite</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#dff261'} ]} onPress={() => {
        setOpen(false);
        setMove(true);
      }}>
        <Text style={styles.modalButtonText}>Move</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>
{move && (
  <Modal visible={move} animationType="slide" transparent={true}>
    <MoveFile setDisplay={setMove} setDestination={setNewFolder} moveFile={moveFile}/>
  </Modal>
)}

    </>
  );
}

const styles = StyleSheet.create({
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  fileName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: "black",
    fontFamily: "Roboto-Italic"
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '70%',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#3d0101',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: 'white',
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
