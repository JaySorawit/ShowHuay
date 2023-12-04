import React, { useState, useEffect, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import AccountNav from './AccountNav';

function EditMyProfile() {

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
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fname: '',
        lname: '',
        telephoneNumber: '',
        gender: '',
        dateOfBirth: '',
      });
    const [newUsername, setNewUsername] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [emailExists, setEmailExists] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);
    /***********************************************************************************************/

    /************************************** Fetch user data ***************************************/
    useEffect(() => {
        const getUserData = async () => {
          try {
            const res = await axios.get(`http://localhost:3000/account/getuser/${userId}`);
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

            const formatDateForInput = (dateString) => {
              if (!dateString) return '';
              const [day, month, year] = dateString.split('/');
              return `${year || ''}-${month || ''}-${day || ''}`;
            };

            setFormData({
              username: res.data.username,
              email: res.data.email,
              fname: res.data.fname,
              lname: res.data.lname,
              telephoneNumber: res.data.telephone_number,
              gender: res.data.gender,
              dateOfBirth: res.data.date_of_birth ? formatDateForInput(res.data.date_of_birth) : '',
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

    /************************************* Check Email *********************************************/
    const handleEmailCheck = async () => {
        try {
        const response = await fetch(`http://localhost:3000/auth/check-email?email=${formData.email}`);
        const data = await response.json();
        setEmailExists(data.exists && formData.email !== user.email);
        } catch (error) {
        console.error('Error checking email:', error);
        }
    };
    /***********************************************************************************************/


    /************************************* Check Username *********************************************/
    const handleUsernameCheck = async () => {
        try {
        const response = await fetch(`http://localhost:3000/auth/check-username?username=${formData.username}`);
        const data = await response.json();
        setUsernameExists(data.exists && formData.username !== user.username);
        } catch (error) {
        console.error('Error checking username:', error);
        }
    };
    /***********************************************************************************************/



    /************************************* Handle Change *********************************************/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        const formattedDate = formatDateForDisplay(value);

        if (name === 'email') {
        setEmailExists(false);
        }

        if (name === 'username') {
        setUsernameExists(false);
        }

    };
    /*************************************************************************************************/


    /************************************** Handle Back **********************************************/
    const handleBack = () => {
        window.location.href = '/myProfile';
      };
    /*************************************************************************************************/


    /************************************* Handle Submit *********************************************/
    const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    /******************** Condition to Submit *********************/
    if (emailExists) {
      emailRef.current.focus();
      return;
    }

    if (usernameExists) {
      usernameRef.current.focus();
      return;
    }

    /**************************************************************/

    try {
      const registerResponse = await fetch(`http://localhost:3000/account/updateuser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (registerResponse.ok) {
        window.location.href = '/myProfile';
        };

      console.log(data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  /*************************************************************************************************/

  const formatForInput = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = (dateString || '').split('/');
    return `${year || ''}-${month || ''}-${day || ''}`;
  };
  

  console.log(user.dateOfBirth);


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
                        <h5> Edit Profile</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="form-layout" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={handleUsernameCheck}
                                required
                            />
                            {usernameExists && (
                                <div className="mt-2" style={{ color: 'red' }}>
                                *This username is already in use.
                                </div>
                            )}
                            </Form.Group>

                            <Form.Group className="form-layout" controlId="fname">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="fname"
                                name="fname"
                                value={formData.fname}
                                onChange={handleChange}
                            />
                            </Form.Group>

                            <Form.Group className="form-layout" controlId="lname">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="lname"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                            />
                            </Form.Group>   

                            <Form.Group className="form-layout" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleEmailCheck}
                                required
                            />
                            {emailExists && (
                                <div className="mt-2" style={{ color: 'red' }}>
                                *This email is already in use.
                                </div>
                            )}
                            </Form.Group>

                            <Form.Group className="form-layout" controlId="telephoneNumber">
                            <Form.Label>Telephone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Telephone Number"
                                name="telephoneNumber"
                                value={formData.telephoneNumber}
                                onChange={handleChange}
                            />
                            </Form.Group>

                            <Form.Group className="form-layout" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                                as="select"
                                placeholder="Select Gender"
                                name="gender"
                                ref={passwordRef}
                                defaultValue={user && user.gender ? user.gender : ''}
                                value={formData.gender}
                                onChange={handleChange} 
                            >
                                <option value="" disabled hidden>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                            </Form.Group> 

                            <Form.Group className="form-layout" controlId="dateOfBirth">
                              <Form.Label>Date of Birth</Form.Label>
                              <Form.Control
                                type="date"
                                name="dateOfBirth"
                                defaultValue={user && user.dateOfBirth ? formatForInput(user.dateOfBirth) : ''}
                                value={formData.dateOfBirth}
                                onChange={handleChange} 
                                placeholder="Enter your date of birth"
                              />
                            </Form.Group>

                            <div className="form-layout" style={{ marginBottom: '16px' }}>
                            <div className="button" style={{ display: 'flex', margin: '0 auto', justifyContent: 'center', gap: '50px' }}>
                              <button className="editBtn" type="button" onClick={handleBack}>Back</button>
                                <button className="editBtn" type="submit">Save</button>
                            </div>
                            </div>
                        </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
        <Footer />
    </div>
    );
  }

export default EditMyProfile