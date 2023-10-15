import React from 'react';
import NavDrive from './nav';
import { Container } from 'react-bootstrap';
import AddFolderButton from './addFolderButton';
import { useFolder } from '../../hooks/useFolder';
import Folder from './folder';
import { useParams } from 'react-router-dom';
import FolderBreadcrumbs from './folderBreadcrumbs';
import AddFileButton from './addFileButton';
import File from './file';


function Dashboard() {
    const { folderId } = useParams();
    const { folder, childFolders, childFiles } = useFolder(folderId);
    return ( 
        <>
        <NavDrive />
        <Container fluid>
            <div className="d-flex align-items-center">
                <FolderBreadcrumbs currentFolder={folder} />
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
            </div>
            {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
        </Container>

        </>
     );
}

export default Dashboard;