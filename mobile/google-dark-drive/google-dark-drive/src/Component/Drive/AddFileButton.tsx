import React, { useState } from "react"

import { useAuth } from "../../Contexts/AuthContext"
import { storage, database } from "../../Firebase"
import { ROOT_FOLDER } from "../../Hooks/useFolder"
import "react-native-get-random-values";
import { v4 as uuidV4 } from "uuid"
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { getDocs, query, where, addDoc, updateDoc, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { View, Text, Button, TouchableOpacity, ToastAndroid, Image } from 'react-native';
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
    <View>
      <TouchableOpacity onPress={uploadMenu}>
        <Image source={require('../../../assets/uploadFile2.png')} style={{width: 40, height: 40, marginLeft: 15, }} />
      </TouchableOpacity>
      
    </View>
  );
}
