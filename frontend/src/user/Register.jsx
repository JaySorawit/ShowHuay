/********************************************************************
 *   Register.jsx                                                   *
 *                                                                  *
 *   This page is providing a user interface for the                *
 *   registration or sign-up process. It includes a form            *
 *   for users to input necessary information to create an account. *
 *                                                                  *
 ********************************************************************/

import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, Container, Alert } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import registrationImage from "../assets/Register-left.png";
import "../css/Register.css";

function Register() {
  /************************************* Initialize State *******************************************/
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  /**************************************************************************************************/

  /**************************************** Query Email *********************************************/
  const handleEmailCheck = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/auth/check-email?email=${formData.email}`
      );
      const data = await response.json();
      setEmailExists(data.exists);
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };
  /**************************************************************************************************/

  /************************************* Query Username *********************************************/
  const handleUsernameCheck = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/auth/check-username?username=${formData.username}`
      );
      const data = await response.json();
      setUsernameExists(data.exists);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };
  /**************************************************************************************************/

  /************************************** Handle Change *********************************************/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setEmailExists(false);
    }

    if (name === "username") {
      setUsernameExists(false);
    }

    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(formData.password === value);
    }
  };
  /*************************************************************************************************/

  /************************************** Handle Submit ********************************************/
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

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      passwordRef.current.focus();
      return;
    }
    /**************************************************************/

    try {
      const registerResponse = await fetch(
        "http://localhost:3000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await registerResponse.json();

      if (registerResponse.ok) {
        const loginResponse = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log("Login successful:", loginData);

          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", loginData.username);
          localStorage.setItem("userId", loginData.userId);

          window.location.href = "./";
        }
      }

      console.log(data);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  /*************************************************************************************************/

  return (
    <>
      <Navbar />
      <div className="pt-3 pb-3" style={{ backgroundColor: "#F1F0F0" }}>
        <Container className="p-4" style={{ maxWidth: "1080px" }}>
          <Row className="no-gutters align-items-stretch">
            <Col md={6}>
              <img
                src={registrationImage}
                alt="Registration"
                style={{ width: "100%", height: "100%" }}
              />
            </Col>
            <Col
              md={6}
              style={{
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2 className="header-layout">Register</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-layout" controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailCheck}
                    ref={emailRef}
                    required
                  />
                  {emailExists && (
                    <div className="mt-2" style={{ color: "red" }}>
                      *This email is already in use.
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-layout" controlId="username">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleUsernameCheck}
                    ref={usernameRef}
                    required
                  />
                  {usernameExists && (
                    <div className="mt-2" style={{ color: "red" }}>
                      *This username is already in use.
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-layout" controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    ref={passwordRef}
                    required
                  />
                </Form.Group>

                <Form.Group className="form-layout" controlId="confirmPassword">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {!passwordMatch && (
                    <div className="mt-2" style={{ color: "red" }}>
                      *Passwords do not match.
                    </div>
                  )}
                </Form.Group>

                <div className="form-layout" style={{ marginBottom: "16px" }}>
                  <Button className="btn-submit w-100" type="submit">
                    Register
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="link-to-login">
                  Have an account? <a href="/login">Log In</a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default Register;
