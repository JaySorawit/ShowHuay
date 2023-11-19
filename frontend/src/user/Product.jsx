import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate, json } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import QuantityAdjust from "./QuantityAdjust";
// import product1_img from '../assets/img/product-img/product1.png';
import userImage from '../assets/icon/userImage.png'
import RatingStar from "./RatingStar";
import '../css/Product.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Product = () => {
    const { id } = useParams();

    const [product, setProduct] = useState({
      productName: '',
      productDescription: '',
      sellerName: '',
      sellerId: '',
      sellerTel: '',
      categoryId: '',
      price: '',
      totalSold: '',
      stockRemaining: '',
      imgPath: '',
    });

    const [review, setReview] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
      // get product detail
      axios.get("http://localhost:3000/products/" + id)
        .then(function(response) {
          setProduct({
            productName: response.data.product[0].product_name,
            productDescription: response.data.product[0].product_description,
            sellerName: response.data.product[0].username,
            sellerId: response.data.product[0].user_id,
            sellerTel: response.data.product[0].telephone_number,
            categoryId: response.data.product[0].category_id,
            price: response.data.product[0].price,
            totalSold: response.data.product[0].total_sold,
            stockRemaining: response.data.product[0].stock_remaining,
            imgPath: response.data.product[0].image_path,
          });
        })
        .catch(function(error) {
          if (error.response) {
            console.error("Server responded with an error status:", error.response.status);
            console.log("Full response:", error.response);
            if (error.response.status === 404) {
              // Handle 404 Not Found
              // Redirect to the Page not found.
              console.log("Product not found. Navigating...");
              navigate('/*');
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from the server:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up the request:", error.message);
          }
        });
    }, [id, navigate]);    
    
    useEffect(() => {
      // get Review detail
      axios.get("http://localhost:3000/products/getProductReview/" + id)
        .then(function (res) {
          const reviews = res.data.review.map(review => ({
            reviewId: review.review_id,
            reviewerId: review.user_id,
            score: review.review_score,
            reviewText: review.review_text,
            reviewTime: review.review_timestamp,
            reviewName: review.username,
          }));
    
          setReview({
            reviewTotal: reviews.length,
            reviews: reviews,
          });
        });
    }, [id, navigate]);
    
    //Calculate the initialScore for product
    let sumOfScores = 0;
    const reviewArray = review.reviews ? Object.values(review.reviews) : [];
    for (const singleReview of reviewArray) {
      sumOfScores += singleReview.score;
    }

    // Assuming you have a state variable for selectedScore
    const [selectedScore, setSelectedScore] = useState('ALL');

    // Function to handle score selection
    const handleScoreSelection = (score) => {
      setSelectedScore(score);
    };

    const getButtonStyle = (score) => {
      return {
        backgroundColor: selectedScore === score ? '#F44C0C' : 'transparent',
        border: selectedScore === score ? 'none' : 'solid 1px',
        color: selectedScore === score ? 'white' : 'black', 
      };
    };
    
    
    let initialScore = reviewArray.length > 0 ? sumOfScores / review.reviewTotal : 0;
    let stockRemaining = product.stockRemaining;


    return (
        <>
        <Navbar/>
        <div className="BG">
            <div className="container" style={{ width: '1170px', backgroundColor: '#F1F0F0' }}>
              <div className="productShow"> 
              <img src={product.imgPath} />
                <div className="productInfoBox">
                  <h2> {product.productName} </h2>
                  <div className="productInfo">
                    <div style={{display:'flex',gap:'5px' }}>
                      <p> {initialScore} </p> 
                      <RatingStar score={initialScore} />
                    </div>
                    <p> | {review.reviewTotal} Rating </p>
                    <p> | {product.totalSold} Sold </p>
                  </div>
                  <div className="price">
                    <h2> ฿{product.price} </h2>
                  </div>
                  <div className="stockRemaining">
                    <p>Stock Remaining : {stockRemaining}  </p>
                  </div>
                  <div className="quantity">
                  <QuantityAdjust stockRemaining={stockRemaining} />
                  </div>
                  <div className="submitbutton">
                    <button type="submit " style={{color:'#F44C0C',backgroundColor:'#F2BFAC', border: 'solid 3px #F44C0C'}}>Add To Cart </button>
                    <button type="submit " style={{color:'#fff', border:'none', backgroundColor:'#F44C0C'}}>Buy Now </button>
                  </div>
                </div>
              </div>
              <div className="productDescription">
                <h4> Product Description </h4>
                <div dangerouslySetInnerHTML={{ __html: product.productDescription }} />
              </div>
              <div className="seller">
                <img src={userImage} style={{borderRadius: '50%'}}/>
                <div className="SellerInfo">
                  <h4> Seller </h4>
                  <p> Name: {product.sellerName}</p>
                  <p> Phone: {product.sellerTel}</p>
                </div>
                <div className="sellercontact">
                <Link to='/chat'><button>View Profile</button></Link>
                  <Link to='/chat'><button>Chat</button></Link>
                </div>
              </div>
              <div className="ProductRating">
                <h4> Product Score Ratings </h4>
                <div className="RatingInfo">
                  <div className="scorefilter">
                    <div className="productScore">
                      <p> {initialScore} out of 5 </p> 
                      <RatingStar score={initialScore}/>
                    </div>
                    <div className="scoreSelection">
                      <button onClick={() => handleScoreSelection('ALL')} style={getButtonStyle('ALL')}> ALL </button>
                      <button onClick={() => handleScoreSelection(5)} style={getButtonStyle(5)}> 5 Star </button>
                      <button onClick={() => handleScoreSelection(4)} style={getButtonStyle(4)}> 4 Star </button>
                      <button onClick={() => handleScoreSelection(3)} style={getButtonStyle(3)}> 3 Star </button>
                      <button onClick={() => handleScoreSelection(2)} style={getButtonStyle(2)}> 2 Star </button>
                      <button onClick={() => handleScoreSelection(1)} style={getButtonStyle(1)}> 1 Star</button>
                    </div>
                  </div>
                  {review.reviews && review.reviews
                    .filter(singleReview => selectedScore === 'ALL' || singleReview.score === selectedScore)
                    .map((singleReview, index) => (
                      <div className="productComment" key={index}>
                        <img src={userImage} style={{ width: '70px', height: '70px' }} />
                        <div className="commentInfo">
                          <p>{singleReview.reviewName}</p>
                          <RatingStar score={singleReview.score} />
                          <p>{singleReview.reviewTime} | {singleReview.score} out of 5</p>
                          <p>{singleReview.reviewText}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div style={{height:'50px'}}></div>
            </div>
        </div>
        <Footer /> 
        </>
    )
}

export default Product