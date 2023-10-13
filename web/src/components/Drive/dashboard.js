import React from 'react';
import NavDrive from './nav';
import { Container } from 'react-bootstrap';
import AddFolderButton from './addFolderButton';

function Dashboard() {
    return ( 
        <>
        <NavDrive />
        <Container fluid>
            <AddFolderButton />
        </Container>

        </>
     );
}

export default Dashboard;