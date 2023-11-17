import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Navbar from './Navbar';
import registrationImage from '../assets/Register-left.png';
import '../css/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    cpassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Navbar />
      <div className="pt-5" style={{ backgroundColor: '#F1F0F0' }}>
        <Container className="p-4" style={{ maxWidth: '1080px' }}>
          <Row className="no-gutters">
            <Col md={6}>
              <img src={registrationImage} alt="Registration" style={{ width: '100%' }} />
            </Col>
            <Col md={6} style={{ backgroundColor: '#FFFFFF' }}>
              <h2 className="header-layout">Register</h2>

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

                <Form.Group className="form-layout" controlId="username">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
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

                <Form.Group className="form-layout" controlId="cpassword">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="cpassword"
                    value={formData.cpassword}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="form-layout" style={{ marginBottom: '16px' }}>
                  <Button
                    className="btn-submit w-100"

                    type="submit"
                  >
                    Register
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="link-to-login">Have an account? <a href="/login">Log In</a></p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Register;
