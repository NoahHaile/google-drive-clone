import React, { useState } from "react"
import { database } from "../../Firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useAuth } from "../../Contexts/AuthContext"
import { ROOT_FOLDER } from "../../Hooks/useFolder"
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Modal, Image } from 'react-native';

export default function AddFolderButton({ currentFolder }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("");
  const { currentUser } = useAuth();

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (currentFolder == null) return

    const path = [...currentFolder.path]
    if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id })
    }
    console.log(currentFolder);
    const docRef = addDoc(database.folders, {
        name: name,
        parentId: currentFolder.id,
        userId: currentUser.uid,
        path: path,
        createdAt: serverTimestamp(),
    });
    
    setName("")
    closeModal()
  }

  return (
    <View>
      <TouchableOpacity onPress={openModal}>
                <Image source={require('../../../assets/createFolder.png')} style={{width: 40, height: 40, marginLeft: 15}} />

      </TouchableOpacity>
      <Modal
  visible={open}
  animationType="slide" // You can adjust the animation type as needed
  transparent={true}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Folder Name</Text>
      <TextInput
        style={styles.modalInput}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Enter folder name"
      />
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={styles.modalButton1} onPress={closeModal}>
          <Text style={styles.modalButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton2} onPress={handleSubmit}>
          <Text style={styles.modalButtonText}>Add Folder</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
  modalInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton1: {
    backgroundColor: '#700303',
    padding: 5,
    borderRadius: 5,
    marginRight: 20,
    width: '30%',
    alignItems: 'center',
    borderWidth: 0.8, // Border width
    borderColor: 'black', // Border color
    borderStyle: 'solid',
    shadowColor: '#000',
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowOpacity: 0.8,
  shadowRadius: 8,
  },
  modalButton2: {
    backgroundColor: '#093d01',
    padding: 5,
    borderRadius: 5,
    marginleft: 20,
    width: '40%',
    alignItems: 'center',
    borderWidth: 0.8, // Border width
    borderColor: 'black', // Border color
    borderStyle: 'solid',
    shadowColor: '#000',
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowOpacity: 0.8,
  shadowRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'Roboto-Bold',
  },
});

