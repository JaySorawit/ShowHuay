import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import AccountNav from './AccountNav';
import userImage from '../assets/icon/userImage.png';
import  '../css/MyProfile.css';


function MyProfile() {

    /************************************** Initialize State ***************************************/
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState({
        userId: '',
        username: '',
        email: '',
        fname: '',
        lname: '',
        telephoneNumber: '',
        gender: '',
        dateOfBirth: '',
    });
    /***********************************************************************************************/

    /************************************** Fetch user data ***************************************/
    useEffect(() => {
        const getUserData = async () => {
          try {
            const res = await axios.get(`http://localhost:3000/account/getuser/${userId}`);
            // console.log(res.data);
            setUser({
                userId: res.data.user_id,
                username: res.data.username,
                email: res.data.email,
                fname: res.data.fname,
                lname: res.data.lname,
                telephoneNumber: res.data.telephone_number,
                gender: res.data.gender,
                dateOfBirth: res.data.date_of_birth,
            });
          } catch (error) {
            console.error('Error fetching user information or chat history:', error);
            if(id != null){
              if (error.response && error.response.status == 404 ) {
                navigate('/*');
              }
            }
          }
        };
        getUserData();
      }, [userId]);

    /***********************************************************************************************/

    return (
    <div>
        <Navbar />
        <div className="purchases-container" style={{ paddingTop: '35px', paddingBottom: '35px', backgroundColor: '#F1F0F0', minHeight: '640px' }}>
            <Container style={{ maxWidth: '1080px' }}>
                <div className="heading">
                    <h4 style={{ fontSize: '20px' }}>{user.username}'s Account</h4>
                </div>

                <Row>
                    <AccountNav />
                    <Col md={10}>
                        <div className="infoBox">
                            <h5> My Profile</h5>
                            {user ? (
                            <div className="userInfo">
                                <div className="info">
                                <p><b>Username :</b> {user.username || '-'}</p>
                                <p><b>Name :</b> {user.fname || user.lname ? `${user.fname || ''} ${user.lname || ''}` : '-'}</p>
                                <p><b>Email :</b> {user.email || '-'}</p>
                                <p><b>Phone :</b> {user.telephoneNumber || '-'}</p>
                                <p><b>Gender :</b> {user.gender || '-'}</p>
                                <p><b>Date of Birth :</b> {user.dateOfBirth || '-'}</p>
                                </div>
                                <img src={userImage} alt="userImage" />
                            </div>
                            ) : (
                            <p>User information not available</p>
                            )}
                            <Link to='/editMyProfile' style={{margin:'0 auto'}}><button className="editBtn">Edit</button> </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
        <Footer />
    </div>
    );
  }

export default MyProfile