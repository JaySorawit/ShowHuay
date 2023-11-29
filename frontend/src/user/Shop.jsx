import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import backgroundImage from '../assets/shopBackground.png';
import '../css/Shop.css';

const Shop = () => {

    const [sellerInfo, setSellerInfo] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [isSeller, setIsSeller] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:3000/shop/user-info/${userId}`);
                const userData = await response.json();

                if (userData !== null) {
                    setSellerInfo(userData);
                    setIsSeller(true);
                }

            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSellerInfo({ ...sellerInfo, [name]: value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:3000/shop/updateUser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sellerInfo)
            });

            if (response.ok) {
                console.log('User updated successfully');
                window.location.reload();
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    const renderUserInfoForm = () => {
        return (
            <>
                <Navbar />
                <div className="pt-4 pb-5" style={{ backgroundColor: '#F44C0C' }}>
                    <Container className="p-4" style={{ maxWidth: '1080px' }}>
                        <Row className="no-gutters">
                            <Col md={5} style={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }}>
                                <div className="p-4 pt-5 pb-5">
                                    <h5 className='seller-info mb-4' style={{ marginLeft: '40px' }}>Register as a ShowHuay Seller</h5>

                                    <Form onSubmit={handleUpdateUser}>

                                        <Form.Group className="form-layout" controlId="firstName">
                                            <Form.Control
                                                type="text"
                                                placeholder="First Name"
                                                name="firstName"
                                                value={sellerInfo.firstName}
                                                onChange={handleChange}
                                                maxLength="10"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="form-layout" controlId="lastName">
                                            <Form.Control
                                                type="text"
                                                placeholder="Last Name"
                                                name="lastName"
                                                value={sellerInfo.lastName}
                                                onChange={handleChange}
                                                maxLength="20"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="form-layout" controlId="phoneNumber">
                                            <Form.Control
                                                type="tel"
                                                placeholder="Phone Number"
                                                name="phoneNumber"
                                                value={sellerInfo.phoneNumber}
                                                onChange={handleChange}
                                                maxLength="10"
                                                required
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
                                </div>
                            </Col>
                            <Col md={7} style={{
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundColor: '#F44C0C',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}>

                            </Col>

                        </Row>
                    </Container>
                </div>
                <Footer />
            </>
        );
    };

    /************************************* Query Products ******************************************/
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        fetch(`http://localhost:3000/shop/products/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);
    /*************************************************************************************************/

    /************************************** Search Products ******************************************/
    useEffect(() => {
        const results = products.filter(product =>
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };
    /*************************************************************************************************/

    /************************************** View Page of Products ******************************************/
    const navigate = useNavigate();
    const handleView = (productId) => {
        navigate(`/product/${productId}`);
    };
    /******************************************************************************************************/

    /************************************* Delete Products *******************************************/
    const handleDelete = productId => {
        fetch(`http://localhost:3000/shop/deleteProducts/${productId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const updatedProducts = products.filter(product => product.product_id !== productId);
                setProducts(updatedProducts);
                setFilteredProducts(updatedProducts);

                window.alert('Product deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    };
    /*************************************************************************************************/

    return (
        <div>
            {(!isSeller) ? (
                renderUserInfoForm()
            ) : (
                <>
                    <Navbar />
                    <div className="pt-3 pb-3" style={{ backgroundColor: '#F1F0F0' }}>
                        <Container className="p-4" style={{ maxWidth: '1080px' }}>

                            <h4>Products</h4>

                            <div>
                                <button className="add-product-button">
                                    <Link style={{ color: '#fff' }} to="/AddProduct">Add Product</Link>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search by product name..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                            </div>

                            {filteredProducts.map(product => (
                                <Row key={product.product_id} className="mt-4 product-row">
                                    <Col md={4}>
                                        <img
                                            src={product.image_path}
                                            alt={product.product_name}
                                            className="product-image"
                                        />
                                    </Col>
                                    <Col md={8} className="ps-md-0 d-flex align-items-center">
                                        <div className="product-details ms-3">
                                            <h5 className="product-title">{product.product_name}</h5>
                                            <p className="product-description">{product.product_description}</p>
                                            <p className='product-info'>Price: {product.price}฿</p>
                                            <p className='product-info'>Stock remaining: {product.stock_remaining}</p>
                                            <div className="view-edit-delete-buttons">
                                                <button onClick={() => handleView(product.product_id)}>View Page</button>
                                                <button onClick={() => handleEdit(product.product_id)}>Edit</button>
                                                <button onClick={() => handleDelete(product.product_id)}>Delete</button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </Container>
                    </div>
                    <Footer />
                </>
            )
            }
        </div >
    );
};

export default Shop;
