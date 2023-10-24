import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../Contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CenteredContainer from './centeredContainer';

export default function ForgotPassword() {
  const emailRef = useRef();

  const { resetPassword, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    
    
    
    

    try {
        setMessage('');
        setError('');
        setLoading(true);
      await resetPassword(email);
      setMessage('Check your Inbox for further instructions.')
      // Redirect to the dashboard or perform other actions after successful signup.
    } catch (error) {
      // Handle signup error, e.g., display an error message.
      console.error('Failed to Reset Password');
    }
    setLoading(false);
  };

  return (
    <CenteredContainer>
    
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Password Reset</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required />
            </Form.Group>
            
            
            <Button disabled={loading} className='w-100' type='submit'>Reset</Button>
          </Form>
          <div className='w-100 text-center mt-2'>
            <Link to="/login">Login</Link>
        </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to="/signup">Sign Up </Link>
      </div>
    
    </CenteredContainer>
  );
}
