import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import backgroundImage from '../assets/addProductBackground.jpg';

const AddProduct = () => {
    
    /*********************************** Initialize State ********************************************/
    const [productInfo, setProductInfo] = useState({
        category_id: '',
        product_name: '',
        product_description: '',
        price: '',
        stock_remaining: '',
        image_path: null,
    });
    /*************************************************************************************************/

    /************************************* Handle Change *********************************************/
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'image_path') {
            setProductInfo({ ...productInfo, [name]: e.target.files[0] });
        } else {
            setProductInfo({ ...productInfo, [name]: value });
        }
    };
    /*************************************************************************************************/

    /*************************************** Add Product *********************************************/
    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            const userId = localStorage.getItem('userId');
            const formData = new FormData();

            formData.append('category_id', productInfo.category_id);
            formData.append('product_name', productInfo.product_name);
            formData.append('product_description', productInfo.product_description);
            formData.append('price', productInfo.price);
            formData.append('stock_remaining', productInfo.stock_remaining);
            formData.append('image_path', productInfo.image_path);

            const response = await fetch(`http://localhost:3000/shop/addProduct/${userId}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Product added successfully');
                window.location.href = '/shop';
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
    /*************************************************************************************************/

    return (
        <>
            <Navbar />
            <div className="pt-2 pb-3" style={{
                backgroundColor: '#F1F0F0',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
            }}>
                <Container className="p-4" style={{ maxWidth: '1080px' }}>
                    <Row className="no-gutters">
                        <Col md={9} style={{ backgroundColor: '#FFFFFF', borderRadius: '5px', margin: 'auto' }}>
                            <div className="p-4">
                                <Link style={{
                                    marginLeft: '40px',
                                    paddingBottom: '10px',
                                    color: '#F44C0C'
                                }}
                                    to="/shop">&lt; Back</Link>
                                <h5 className="seller-info mt-2 mb-3" style={{ marginLeft: '40px' }}>Add Product</h5>
                                <Form onSubmit={handleAddProduct}>

                                    <Form.Group className="form-layout" controlId="category_id">
                                        <Form.Control
                                            as="select"
                                            name="category_id"
                                            value={productInfo.category_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="0">Clothes</option>
                                            <option value="1">Shoes</option>
                                            <option value="2">Fashion Accessories</option>
                                            <option value="3">Watches & Glasses</option>
                                            <option value="4">Beauty & Personal Care</option>
                                            <option value="5">Pets</option>
                                            <option value="6">Furniture</option>
                                            <option value="7">Home Appliances</option>
                                            <option value="8">Computers & Laptops</option>
                                            <option value="9">Mobile & Gadgets</option>
                                            <option value="10">Tools & Home Improvement</option>
                                            <option value="11">Health & Household</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group className="form-layout" controlId="product_name">
                                        <Form.Control
                                            type="text"
                                            placeholder="Product Name"
                                            name="product_name"
                                            value={productInfo.product_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="form-layout" controlId="product_description">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Product Description"
                                            name="product_description"
                                            value={productInfo.product_description}
                                            onChange={handleChange}
                                            rows={4}
                                            style={{ height: '120px' }}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="form-layout" controlId="price">
                                        <Form.Control
                                            type="text"
                                            placeholder="Price"
                                            name="price"
                                            value={productInfo.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-layout" controlId="stock_remaining">
                                        <Form.Control
                                            type="text"
                                            placeholder="Quantity"
                                            name="stock_remaining"
                                            value={productInfo.stock_remaining}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="form-layout" controlId="image_path">
                                        <Form.Label style={{ fontWeight: '400' }}>Product Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="image_path"
                                            onChange={handleChange}
                                            accept=".jpg, .jpeg, .png"
                                            style={{ height: '38px' }}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="form-layout" style={{ marginBottom: '16px' }}>
                                        <Button className="btn-submit w-100" type="submit">
                                            Add Product
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default AddProduct;
