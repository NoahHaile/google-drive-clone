import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavDrive() {
    return (
        <Navbar bg="light" expand="sm">
            <Navbar.Brand as={Link} to="/">
                WDS Drive
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to='/user'>
                    Profile
                </Nav.Link>
            </Nav>

        </Navbar>
    );
}

export default NavDrive;