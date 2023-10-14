import React from 'react';
import NavDrive from './nav';
import { Container } from 'react-bootstrap';
import AddFolderButton from './addFolderButton';
import { useFolder } from '../../hooks/useFolder';
import Folder from './folder';

function Dashboard() {
    const { folder, childFolders } = useFolder("UXrdpi8iFs7s1dvGO7iz");
    
    return ( 
        <>
        <NavDrive />
        <Container fluid>
            <AddFolderButton currentFolder={folder} />
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
        </Container>

        </>
     );
}

export default Dashboard;