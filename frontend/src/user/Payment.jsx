import React from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';

function Payment() {
  return (
    <>
    <Navbar />
    <Container>
        <Row>
            <Col>
                <h1>Payment</h1>
            </Col>
            <Col>
                <button type="button" class="btn btn-primary">Place Order</button>
            </Col>
        </Row>
    </Container>
    <Footer />
    </>
  )
}

export default Payment