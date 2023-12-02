import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';

function AccountNav() {


  return (
    <>
    <Col md={2}>
        <div><h5 style={{ fontSize: '16px' }}>My Account</h5></div>
        <Col md={12}>
            <Link to="/myProfile" style={{ color: '#000000', textDecoration: 'none' }}>
                <div className="my-account-menu" style={{ backgroundColor: '#F1F0F0', padding: '10px 0px 10px 0px', borderBottom: '1px solid #E5E5E5' }}>
                    <p style={{ fontSize: '14px' }}>My Profile</p>
                </div>
            </Link>
            <Link to="/myAddress" style={{ color: '#000000', textDecoration: 'none' }}>
                <div className="my-account-menu" style={{ backgroundColor: '#F1F0F0', padding: '10px 0px 10px 0px', borderBottom: '1px solid #E5E5E5' }}>
                    <p style={{ fontSize: '14px' }}>Address</p>
                </div>
            </Link>
            <Link to="/myCreditCard" style={{ color: '#000000', textDecoration: 'none' }}>
                <div className="my-account-menu" style={{ backgroundColor: '#F1F0F0', padding: '10px 0px 10px 0px', borderBottom: '1px solid #E5E5E5' }}>
                    <p style={{ fontSize: '14px' }}>Bank & Credit cards</p>
                </div>
            </Link>
            <Link to="/changePassword" style={{ color: '#000000', textDecoration: 'none' }}>
                <div className="my-account-menu" style={{ backgroundColor: '#F1F0F0', padding: '10px 0px 10px 0px', borderBottom: '1px solid #E5E5E5' }}>
                    <p style={{ fontSize: '14px' }}>Changes Password</p>
                </div>
            </Link>
        </Col>
    </Col>
    </>
  )
}

export default AccountNav