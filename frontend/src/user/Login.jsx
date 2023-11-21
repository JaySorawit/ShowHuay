import React, { useState, useRef, useEffect  } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import loginImage from '../assets/Register-left.png';
import belowLoginImage from '../assets/below-login-image.png';
import '../css/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  /************************ Initialize State *****************************/
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  /***********************************************************************/

  /************************************* Handle Change *********************************************/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  /*************************************************************************************************/

  /************************************* Handle Submit *********************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('Login successful:', loginData);

        if (formData.email === 'admin@showhuay.com') {
          // Admin Role
          window.location.href = '/Admin';
        } else {
          // User Role
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', loginData.username);
          localStorage.setItem('userId', loginData.userId);

          window.location.href = '/';
        }
      }
      else {
        const errorData = await loginResponse.json();
        if (errorData.error === 'User not found') {
          emailRef.current.focus();
          setError('*User not found');
        }
        else if (errorData.error === 'Incorrect password') {
          passwordRef.current.focus();
          setError('*Incorrect password');
        }
        else {
          setError('An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
  /*************************************************************************************************/

  return (
    <>
      <Navbar />
      <div className="pt-3 pb-3" style={{ backgroundColor: '#F1F0F0' }}>
        <Container className="p-4" style={{ maxWidth: '1080px' }}>
          <Row className="no-gutters">
            <Col md={6}>
              <img src={loginImage} alt="Login" style={{ width: '100%' }} />
            </Col>
            <Col md={6} style={{ backgroundColor: '#FFFFFF' }}>
              <h2 className="header-layout">Log In</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-layout" controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    ref={emailRef}
                    require
                  />
                </Form.Group>

                <Form.Group className="form-layout" controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    ref={passwordRef}
                    require
                  />
                  {error && <div className="error-message mt-2" style={{ color: 'red' }}>{error}</div>}
                </Form.Group>

                <div className="form-layout" style={{ marginBottom: '16px' }}>
                  <Button className="btn-submit w-100" type="submit">
                    Log in
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="link-to-register">Don't have an account? <a href="/register">Register</a></p>
                <img src={belowLoginImage} alt="Register Image" className='below-login-img' style={{ width: '150px' }} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default Login;
