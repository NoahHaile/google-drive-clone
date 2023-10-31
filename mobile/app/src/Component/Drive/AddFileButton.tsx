import React, { useState } from "react"

import { useAuth } from "../../Contexts/AuthContext"
import { storage, database } from "../../Firebase"
import { ROOT_FOLDER } from "../../Hooks/useFolder"
import "react-native-get-random-values";
import { v4 as uuidV4 } from "uuid"
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { getDocs, query, where, addDoc, updateDoc, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { StyleSheet, View, Text, Button, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([])

  const { currentUser } = useAuth()
  
  const uploadMenu = async () => { try {
    const result: any = await DocumentPicker.getDocumentAsync();

    // The selected file details are available in the 'result' object
    
    if (result) {
      setUploadingFiles([result]);
      console.log(uploadingFiles)
      handleUpload(result);
      setUploadingFiles([]);
      
    }
    
  } catch (err) {
      throw err;
  }
};

  const handleUpload = async (file) => {
    if (currentFolder == null || file == null) return

    const id = uuidV4()
    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id: id, name: file.assets[0].name, progress: 0, error: false },
    ])
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.assets[0].name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.assets[0].name}`

    const storageRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);
    const response = await fetch(file.assets[0].uri);
      const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }
            return uploadFile;
          });
        });
      },
      () => {
        // Handle the upload error
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
      },
      () => {
        // Remove the file from the uploading files state
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });
      
        // Get the download URL for the uploaded file
        let urlGlobal;
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            urlGlobal = url;
            // Check if a file with the same name, userId, and folderId exists
            return getDocs(
              query(
                database.files,
                where("name", "==", file.assets[0].name),
                where("userId", "==", currentUser.uid),
                where("folderId", "==", currentFolder.id)
              )
            );
          })
          .then((existingFiles) => {
            if (!existingFiles.empty) {
              const existingFile = existingFiles.docs[0];
              updateDoc(existingFile.ref, { url: urlGlobal });
            } else {
              return addDoc(database.files, {
                url: urlGlobal,
                name: file.assets[0].name,
                createdAt: serverTimestamp(),
                folderId: currentFolder.id,
                userId: currentUser.uid,
                fav: false,
                deleted: false,
              });
            }
          })
          .catch((error) => {
            console.error("Error during Firestore operation:", error);
          });
      }
    )
  }

  return (
    <View style={{marginTop: 10}}>
      <TouchableOpacity style={styles.modalButton2} onPress={uploadMenu}>
          <Image source={require('../../../assets/uploading.gif')} style={{width: 30, height: 30}} />
          <Text style={styles.modalButtonText}>Upload File</Text>
        </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  modalButton2: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333', // Darker border color
    borderStyle: 'dashed',
    shadowColor: 'rgba(0, 0, 0, 1)', // Slight shadow with transparency
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1, // Full shadow opacity
    shadowRadius: 8,
    // Add a linear gradient background to make it more interesting
    // You may need to install 'react-native-linear-gradient' and import it
    // gradient colors can be adjusted as per your preference
    // For example, from white to a light shade of blue
    // This adds a subtle gradient to the button's background
    // You can adjust the 'start' and 'end' properties to control the gradient direction
  },
  
  modalButtonText: {
    color: '#333', // Dark text color
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
  },
})