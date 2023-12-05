import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import RatingStar from "./RatingStar";
import '../css/ShopProfile.css';
import userImage from '../assets/icon/userImage.png';

const ShopProfile = () => {

    /********************************** Initialize State ******************************************/
    const { id } = useParams();
    const userId = localStorage.getItem('userId');
    const [sellerInfo, setSellerInfo] = useState({
        userId: '',
        username: '',
        email: '',
        fname: '',
        lname: '',
        telephoneNumber: '',
        gender: '',
        dateOfBirth: '',
    });
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    /**********************************************************************************************/

    /************************************** Fetch user data ***************************************/
    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/account/getuser/${id}`);
                setSellerInfo({
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
                if (id != null) {
                    if (error.response && error.response.status == 404) {
                        navigate('/*');
                    }
                }
            }
        };
        getUserData();
    }, [id]);

    /***********************************************************************************************/

    /********************************* Query Information Product ***********************************/
    useEffect(() => {
        fetch(`http://localhost:3000/shop/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(async data => {
                setProducts(data);
                setFilteredProducts(data);
                setProductCount(data.length);

                const productPromises = data.map(async product => {
                    try {
                        const totalSoldResponse = await axios.get(`http://localhost:3000/product/${product.product_id}`);
                        const totalSold = totalSoldResponse.data.product[0].total_sold;

                        const reviewResponse = await axios.get(`http://localhost:3000/product/getProductReview/${product.product_id}`);

                        let averageScore = 0;
                        if (reviewResponse.data.review.length > 0) {
                            const reviews = reviewResponse.data.review.map(review => ({
                                score: review.review_score,
                            }));

                            let totalScore = 0;
                            reviews.forEach(review => {
                                totalScore += review.score;
                            });
                            averageScore = totalScore / reviews.length;
                        }

                        return {
                            ...product,
                            total_sold: totalSold,
                            review_score: Math.round(averageScore),
                        };
                    } catch (error) {
                        return {
                            ...product,
                            total_sold: 0,
                            review_score: 0,
                        };
                    }
                });

                const updatedProducts = await Promise.all(productPromises);
                setProducts(updatedProducts);
                setFilteredProducts(updatedProducts);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [id]);
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

    /***************************************** Link to Chat **********************************************/
    const navigate = useNavigate();
    const handleChat = (sellerId) => {
        navigate(`/chat/${sellerId}`);
    };
    /******************************************************************************************************/

    return (
        <div>
            <Navbar />
            <div className="product-container" style={{ paddingBottom: '35px', backgroundColor: '#F1F0F0', minHeight: '640px' }}>
                <div className="heading-shop-profile">
                    <Container style={{ maxWidth: '1080px', display: 'flex', alignItems: 'center', minHeight: '100%' }}>
                        <div className="box-seller">
                            <Row>
                                <Col md={4} className="ps-4">
                                    <div className="box-seller-image">
                                        <img src={userImage} alt="userImage" className="seller-image" />
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="box-seller-info">
                                        <h5 className="title-seller"><i className="nav-icon fas fa-user" style={{ fontSize: '14px', marginLeft: '1px', marginRight: '8px' }} />
                                            {sellerInfo.username}
                                        </h5>
                                        <h5 className="tel-seller"><i className="nav-icon fas fa-phone" style={{ fontSize: '14px', marginRight: '7px', transform: 'rotate(90deg)' }} />
                                            Phone: {sellerInfo.telephoneNumber}
                                        </h5>
                                        <h5 className="info-seller"><i className="nav-icon fas fa-store" style={{ fontSize: '14px', marginRight: '4px' }} />
                                            Products: {productCount}
                                        </h5>
                                        {
                                            sellerInfo.userId != userId &&
                                            <button className="chat-button" onClick={() => handleChat(sellerInfo.userId)}>Chat</button>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
                <div className="pt-3 pb-3" style={{ backgroundColor: '#F1F0F0', minHeight: '640px' }}>
                    <Container style={{ maxWidth: '1080px' }}>
                        {productCount === 0 ? (
                            <div className="no-products">
                                <div>
                                    <i className="nav-icon fas fa-shopping-basket mb-2" style={{ color: '#F44C0C', fontSize: '64px' }} />
                                </div>
                                <p>No products available</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Search in this shop..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="search-input ms-0"
                                    />
                                </div>

                                <div className="row-card row-cols-2 row-cols-md-5 g-3">
                                    {filteredProducts.map(product => (
                                        <div key={product.product_id} className="col mb-4">
                                            <Link to={`/Products/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div className="product-card">
                                                    <img
                                                        src={product.image_path}
                                                        alt={product.product_name}
                                                        className="product-card-image"
                                                    />
                                                    <div className="product-card-details">
                                                        <h5 className="product-card-title">{product.product_name}</h5>
                                                        <p className="product-card-info">฿{product.price}</p>
                                                        <div className="product-card-footer">
                                                            <RatingStar score={product.review_score} />
                                                            <p className="product-card-sold">{product.total_sold} sold</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                    ))}
                                </div>
                            </>
                        )}
                    </Container>
                </div>
            </div >
            <Footer />
        </div >
    );
};

export default ShopProfile;
