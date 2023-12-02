import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { format } from 'date-fns';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/myPurchases.css';

const MyPurchases = () => {

    /************************************** Initialize State ***************************************/
    const [username, setUsername] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    useEffect(() => {
        setUsername(localStorage.getItem('username'));
    }, []);
    /***********************************************************************************************/

    /************************************* Query Purchases ********************************************/
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        fetch(`http://localhost:3000/account/purchases/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPurchases(data);
                const productIds = data.map(purchase => purchase.product_id);

                const productDetailsRequests = productIds.map(productId =>
                    fetch(`http://localhost:3000/products/${productId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch product with ID: ${productId}`);
                            }
                            return response.json();
                        })
                );

                const usernameRequests = productIds.map(productId =>
                    fetch(`http://localhost:3000/account/username/${productId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch username for product with ID: ${productId}`);
                            }
                            return response.json();
                        })
                );

                Promise.all([...productDetailsRequests, ...usernameRequests])
                    .then(results => {
                        const productsData = results.slice(0, productIds.length);
                        const usernamesData = results.slice(productIds.length);

                        const purchasesWithProducts = data.map((purchase, index) => ({
                            ...purchase,
                            productDetails: productsData[index].product[0],
                            username: usernamesData[index].username
                        }));
                        setFilteredPurchases(purchasesWithProducts);
                    })
                    .catch(error => {
                        console.error('Error fetching product or username details:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching purchases:', error);
            });
    }, []);
    /***************************************************************************************************/

    /************************************** View Page of Products ******************************************/
    const navigate = useNavigate();
    const handleView = (productId) => {
        navigate(`/product/${productId}`);
    };
    /******************************************************************************************************/

    const sortedPurchases = [...filteredPurchases].sort((a, b) => b.purchase_id - a.purchase_id);

    return (
        <div>
            <Navbar />
            <div className="purchases-container" style={{ paddingTop: '35px', paddingBottom: '35px', backgroundColor: '#F1F0F0', minHeight: '640px' }}>
                <Container style={{ maxWidth: '1080px' }}>
                    <div className="heading">
                        <h4 style={{ fontSize: '20px' }}>{username}'s Purchases</h4>
                    </div>

                    <Row>
                        <Col md={2}>
                            <div>
                                <h5 style={{ fontSize: '16px' }}>My Purchases</h5>
                            </div>
                        </Col>
                        <Col md={10}>
                            {sortedPurchases.length === 0 ? (
                                <div className="no-orders">
                                    <div>
                                        <i className="nav-icon fas fa-shopping-basket mb-2" style={{ color: '#F44C0C', fontSize: '64px' }} />
                                    </div>
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                sortedPurchases.map((purchase) => (
                                    <Row key={purchase.purchase_id} className="purchase-item">
                                        <div>
                                            {purchase.username && (
                                                <div className="heading-purchases">
                                                    <i className="nav-icon fas fa-store me-2" style={{ color: '#F44C0C', fontSize: '14px' }} />
                                                    <span style={{ fontWeight: '500' }}>{purchase.username}</span>
                                                    <button className="view-button ms-2" onClick={() => handleView(purchase.product_id)}>View Page</button>
                                                </div>
                                            )}
                                            {purchase.productDetails && (
                                                <div className="content-purchases">
                                                    <Row>
                                                        <Col md={2}>
                                                            <img
                                                                src={purchase.productDetails.image_path}
                                                                alt={purchase.productDetails.product_name}
                                                                className="product-image"
                                                                style={{ width: '120px', height: '120px' }}
                                                            />
                                                        </Col>

                                                        <Col md={9}>
                                                            <div>
                                                                <p className="content-text">{purchase.productDetails.product_name}</p>
                                                                <p className="content-text">x{purchase.quantity}</p>
                                                            </div>
                                                        </Col>

                                                        <Col md={1}>
                                                            <div className="mt-4">
                                                                <p className="content-text" style={{ color: '#F44C0C', fontWeight: '500' }}>฿{purchase.productDetails.price}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )}

                                            {purchase.productDetails && (
                                                <div className="footer-purchases">
                                                    <Row>
                                                        <Col>
                                                            <p className="mt-2 text-muted" style={{ fontSize: '12px' }}>Payment time: {format(new Date(purchase.payment_timestamp), 'dd/MM/yyyy HH:mm:ss')}</p>
                                                        </Col>
                                                        <Col>
                                                            <p className="content-text text-right">Order Total:&nbsp;
                                                                <span style={{ color: '#F44C0C', fontWeight: '500', fontSize: '20px' }}>฿{purchase.productDetails.price * purchase.quantity}</span>
                                                            </p>
                                                        </Col>
                                                    </Row>

                                                </div>
                                            )}
                                        </div>
                                    </Row>
                                ))
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default MyPurchases;
