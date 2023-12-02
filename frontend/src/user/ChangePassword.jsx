import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { format } from 'date-fns';
import Navbar from './Navbar';
import Footer from './Footer';
import AccountNav from './AccountNav';

function ChangePassword() {

    /************************************** Initialize State ***************************************/
    const username = localStorage.getItem("username");
    /***********************************************************************************************/
    
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
                        
                    </Col>
                </Row>
            </Container>
        </div>
        <Footer />
    </div>
  )
}

export default ChangePassword