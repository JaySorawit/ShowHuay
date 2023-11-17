import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Navbar from './Navbar';
import loginImage from '../assets/Register-left.png';
import belowLoginImage from '../assets/below-login-image.png';
import '../css/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        window.location.href = './';
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);

      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="pt-5" style={{ backgroundColor: '#F1F0F0' }}>
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
                  />
                </Form.Group>

                <Form.Group className="form-layout" controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="form-layout" style={{ marginBottom: '16px' }}>
                  <Button className="btn-submit w-100" type="submit">
                    Log in
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="link-to-register">Don't have an account? <a href="/register">Register</a></p>
                <img src={belowLoginImage} alt="Register Image" className='below-login-img' />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Login;
