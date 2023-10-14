import React from 'react';
import NavDrive from './nav';
import { Container } from 'react-bootstrap';
import AddFolderButton from './addFolderButton';
import { useFolder } from '../../hooks/useFolder';

function Dashboard() {
    const { folder } = useFolder();
    
    return ( 
        <>
        <NavDrive />
        <Container fluid>
            <AddFolderButton currentFolder={folder} />
        </Container>

        </>
     );
}

export default Dashboard;