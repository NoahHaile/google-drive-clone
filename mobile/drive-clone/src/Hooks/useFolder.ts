import { useReducer, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { collection, query, onSnapshot, doc, where, orderBy } from "firebase/firestore";
import { database } from "../firebase";

// Define the action types
enum ACTIONS {
  SELECT_FOLDER = "select-folder",
  UPDATE_FOLDER = "update-folder",
  SET_CHILD_FOLDERS = "set-child-folders",
  SET_CHILD_FILES = "set-child-files",
}

// Define the folder type
interface Folder {
  name: string;
  id: string | null;
  path: string[];
}

// Define the state type
interface State {
  folderId: string | null;
  folder: Folder | null;
  childFolders: Folder[];
  childFiles: any[]; // Replace with the actual file type
}

function reducer(state: State, { type, payload }: { type: ACTIONS; payload: any }): State {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
}

export const ROOT_FOLDER: Folder = { name: "Root", id: null, path: [] };

export function useFolder(folderId: string | null = null, folder: Folder | null = null): State {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folderId, folder]);

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    const folderRef = doc(database.folders, folderId);

    onSnapshot(folderRef, (docI) => {
      const folderData = docI.data() as Folder; // Assuming folderData matches the Folder type
      folderData.id = docI.id;
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: folderData },
      });
    });
  }, [folderId]);

  useEffect(() => {
    const childFoldersQuery = query(
      database.folders,
      where("parentId", "==", folderId),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt")
    );

    const unsubscribeChildFolders = onSnapshot(childFoldersQuery, (snapshot) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FOLDERS,
        payload: {
          childFolders: snapshot.docs.map((docI) => {
            const folderData = docI.data() as Folder; // Assuming folderData matches the Folder type
            folderData.id = docI.id;
            return folderData;
          }),
        },
      });
    });

    return unsubscribeChildFolders;
  }, [folderId, currentUser]);

  useEffect(() => {
    const childFilesQuery = query(
      database.files,
      where("folderId", "==", folderId),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribeChildFiles = onSnapshot(childFilesQuery, (snapshot) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FILES,
        payload: { childFiles: snapshot.docs.map((docI) => {
          const filesData = docI.data(); // You should replace this with the actual file type
          filesData.id = docI.id;
          return filesData;
        }) },
      });
    });

    return unsubscribeChildFiles;
  }, [folderId, currentUser]);

  return state;
}
