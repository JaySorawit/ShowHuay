// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Form, Button, Row, Col, Container } from 'react-bootstrap';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import backgroundImage from '../assets/shopBackground.png';

// const AddProduct = () => {
//     const [product, setProduct] = useState({
//         category_id: '',
//         product_name: '',
//         product_description: '',
//         price: '',
//         stock_remaining: '',
//         image_path: '',
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const userId = localStorage.getItem('userId');
//             const response = await fetch(`http://localhost:3000/shop/addProduct`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(product)
//             });

//             if (response.ok) {
//                 console.log('Product added successfully');
//                 window.location.reload();
//             } else {
//                 console.error('Failed to add product');
//             }
//         } catch (error) {
//             console.error('Error occurred:', error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="pt-4 pb-5" style={{ backgroundColor: '#F44C0C' }}>
//                 <Container className="p-4" style={{ maxWidth: '1080px' }}>
//                     <Row className="no-gutters">
//                         <Col md={5} style={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }}>
//                             <div className="p-4 pt-5 pb-5">
//                                 <h5 className='seller-info mb-4' style={{ marginLeft: '40px' }}>Register as a ShowHuay Seller</h5>

//                                 <Form onSubmit={handleUpdateUser}>

//                                     <Form.Group className="form-layout" controlId="firstName">
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="First Name"
//                                             name="firstName"
//                                             value={sellerInfo.firstName}
//                                             onChange={handleChange}
//                                             maxLength="10"
//                                             required
//                                         />
//                                     </Form.Group>

//                                     <Form.Group className="form-layout" controlId="lastName">
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="Last Name"
//                                             name="lastName"
//                                             value={sellerInfo.lastName}
//                                             onChange={handleChange}
//                                             maxLength="20"
//                                             required
//                                         />
//                                     </Form.Group>

//                                     <Form.Group className="form-layout" controlId="phoneNumber">
//                                         <Form.Control
//                                             type="tel"
//                                             placeholder="Phone Number"
//                                             name="phoneNumber"
//                                             value={sellerInfo.phoneNumber}
//                                             onChange={handleChange}
//                                             maxLength="10"
//                                             required
//                                         />
//                                     </Form.Group>

//                                     <div className="form-layout" style={{ marginBottom: '16px' }}>
//                                         <Button
//                                             className="btn-submit w-100"
//                                             type="submit"
//                                         >
//                                             Register
//                                         </Button>
//                                     </div>
//                                 </Form>
//                             </div>
//                         </Col>
//                         <Col md={7} style={{
//                             backgroundImage: `url(${backgroundImage})`,
//                             backgroundColor: '#F44C0C',
//                             backgroundSize: 'contain',
//                             backgroundPosition: 'center',
//                             backgroundRepeat: 'no-repeat',
//                         }}>

//                         </Col>

//                     </Row>
//                 </Container>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default AddProduct;
