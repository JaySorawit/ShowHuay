/********************************************************************
 *   ChangePassword.jsx                                             *
 *                                                                  *
 *   This page is representing the user interface for changing      *
 *   the password. It includes a form for entering the current      *
 *   and new passwords, confirm password.                           *
 *                                                                  *
 ********************************************************************/

import React, { useState, useEffect,useRef } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import AccountNav from './AccountNav';

function ChangePassword() {

    /************************************** Initialize State ***************************************/
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      const [error, setError] = useState('');
    /***********************************************************************************************/

    /************************************* Handle Change *********************************************/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    
        if (name === 'confirmPassword' && value !== formData.newPassword) {
          setError('New password and confirm password must match!');
        } else {
          setError('');
        }
      };
    
      
  /*************************************************************************************************/


  /************************************* Handle Submit *********************************************/
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password must match!');
    } else {
      setError('');
  
      const changePasswordData = axios.post(`http://localhost:3000/account/changePassword/${userId}`, formData);
  
      changePasswordData.then((response) => {
        alert('Password changed successfully!');
        window.location.href = "/changePassword";
      }).catch((error) => {
        console.error('Error changing password:', error);
  
        if (error.response && error.response.status === 400 && error.response.data.error === 'Old password is incorrect') {
          alert('Current password is incorrect. Please try again.');
        } else {
          alert('Failed to change password. Please try again.');
        }
      });
    }
  };
  
  /*************************************************************************************************/
    
  return (
    <div>
        <Navbar />
        <div className="purchases-container" style={{ paddingTop: '35px', paddingBottom: '35px', backgroundColor: '#F1F0F0', minHeight: '640px' }}>
            <Container style={{ maxWidth: '1080px' }}>
                <div className="heading">
                    <h4 style={{ fontSize: '20px' }}>{username}'s Account</h4>
                </div>

                <Row>
                    <AccountNav />
                    <Col md={10}>
                        <div className="infoBox">
                        <h5> Change Password</h5>
                        <Form onSubmit={handleSubmit}>
                        <Form.Group className="form-layout" controlId="currentPassword">
                            <Form.Label>Current Password:</Form.Label>
                            <Form.Control
                            type="password"
                            placeholder="Current Password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>

                        <Form.Group className="form-layout" controlId="newPassword">
                            <Form.Label>New Password:</Form.Label>
                            <Form.Control
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>

                        <Form.Group className="form-layout" controlId="confirmPassword">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            />
                            {formData.confirmPassword !== formData.newPassword && (
                            <p style={{ color: 'red' }}>New password and confirm password is not match!</p>
                            )}
                        </Form.Group>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="editBtn" style={{ width: '200px' }} type="submit">
                            Change Password
                            </button>
                        </div>
                        </Form>
                        </div>  
                    </Col>
                </Row>
            </Container>
        </div>
        <Footer />
    </div>
  )
}

export default ChangePassword