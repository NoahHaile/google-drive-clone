import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CenteredContainer from './centeredContainer';

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateUserEmail, updateUserPassword } = useAuth();
  const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;
    
    if (password !== passwordConfirm) {
      // Handle password mismatch error, e.g., display an error message.
      return setError('Passwords do not match');
    }
    const promises = [];
    setError('');
    setLoading(true);

    if ( email !== currentUser.email ){
        promises.push(updateUserEmail(email))
    }
    if ( password !== currentUser.password ){
        promises.push(updateUserPassword(password))
    }

    Promise.all(promises).then(() => {
        history.push('/user');
    }).catch(() => {
        setError('Failed to update account')
    }).finally(() => setLoading(false))
    
   };

  return (
    <CenteredContainer>
    
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Profile</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required defaultValue={currentUser.email} />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Form.Group id='password-confirm'>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type='password' ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Button disabled={loading} className='w-100' type='submit'>Update</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link to="/user">Cancel</Link>
      </div>
    
    </CenteredContainer>
    
  );
}
