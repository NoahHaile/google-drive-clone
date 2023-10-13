import React from 'react';
import { Button } from 'react-bootstrap';

function AddFolderButton() {
    function openModal(){
        
    }
    return (
        <Button onClick={openModal} variant="outline-success" size="sm">
            Add
        </Button>
    );
}

export default AddFolderButton;