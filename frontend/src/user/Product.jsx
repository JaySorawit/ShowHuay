import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer";
import product1_img from '../assets/img/product-img/product1.png'
import RatingStar from "./RatingStar";
import '../css/Product.css'
import "bootstrap/dist/css/bootstrap.min.css";

const Product = () => {
    const { id } = useParams();
    const [url, setUrl] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState({});
    const [stocks, setStocks] = useState([]);
    const [images, setImages] = useState([]);
    // const [show, setShow] = useState(false);
    // const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const cart = useSelector((state) => state.cart);
    // const fontSize = useSelector((state) => state.fontSize);
    const [error, setError] = useState({
      title: "",
      message: "",
      type: "",
      link: "",
    });
  
    // get product information from the backend, including colors, images, and stock
    useEffect(() => {
      // get product detail
      const getProduct = async () => {
        try {
          const res = await axios.get(
            // "http://localhost:3000/api/products/" + id
          );
          if (res.data.length !== 1) {
            navigate("/*");
          }
          setProduct(res.data[0]);
        } catch (error) {
          console.log(error);
        }
      };
  
      // get the color details of the product
      const getColors = async () => {
        try {
          const res = await axios.get(
            // "http://localhost:3000/api/products/color/" + id
          );
          setColors(res.data);
        } catch (error) {
          console.log(error);
        }
      };
  
      // get the images of the product
      const getImages = async () => {
        try {
          const res = await axios.get(
            // "http://localhost:3000/api/products/img/" + id
          );
          setImages(res.data);
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].is_main_color) {
              setMainColor(res.data[i].product_color_id);
              setUrl(res.data[i].img_link);
              break;
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      // get the stock details of the product
      const getStocks = async () => {
        try {
          const res = await axios.get(
            // "http://localhost:3000/api/products/stock/" + id
          );
          setStocks(res.data);
        } catch (error) {
          console.log(error);
        }
      };
  
      getProduct();
      getColors();
      getImages();
      getStocks();
    }, [id, navigate]);
    
    const initialScore = 4.8;
    let stockRemaining = 9;

    // adjustProductQuantity
    const ProductQuantityAdjuster = () => {
      const handleIncrease = () => {
        if (quantity < stockRemaining) {
          setQuantity(quantity + 1);
        }
      };
  
      const handleDecrease = () => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
      };
  
      return (
        <div className="quantity">
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease} disabled={quantity === product.stockRemaining}>
            +
          </button>
        </div>
      );
    };

    return (
        <>
        <Navbar/>
        <div className="BG" style={{ width: '100%' }}>
            <div className="container-xxl" style={{ width: '1170px', backgroundColor: '#F1F0F0' }}>
              <div className="productShow"> 
                <img src={product1_img} style={{width: '40%',marginTop:'50px'}}/>
                <div className="productInfo">
                  <h2> Nike Dunk Low Retro White Black (2021)[พร้อมส่งของแท้] </h2>
                  <div className="productInfo">
                    <p> 4.8 </p> 
                    <RatingStar score={initialScore} />
                    <p> | </p>
                    <p> 69 Rating </p>
                    <p> | </p>
                    <p> 1526 Sold </p>
                  </div>
                  <div className="price">
                    <h2> ฿3900 </h2>
                  </div>
                  <div className="stockRemaining">
                    <p>Stock Remaining : {stockRemaining}  </p>
                  </div>
                  <div className="quantity">
                  <ProductQuantityAdjuster />
                  </div>
                  <div className="submitbutton">
                    <button type="submit ">Add To Cart </button>
                    <button type="submit ">Buy Now </button>
                  </div>
                </div>
              </div>
              <div className="productDescription">
                <h2> Product Description </h2>
                <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel ullam laborum aliquam cumque, eius commodi minus eos, tempore magni necessitatibus, facere unde veniam nisi in dignissimos consectetur omnis animi harum.</p>
              </div>
              <div className="seller">
                <img src="./img" style={{borderRadius: '50%'}}/>
                <div className="SellerInfo">
                  <p> Name: Jay Sorawit</p>
                  <p> Phone: 0123456789</p>
                </div>
                <div className="sellercontact">
                  <button>View Profile</button>
                  <Link to='/chat'><button>Chat</button></Link>
                </div>
              </div>
              <div className="ProductRating">
                <h3> Product Score Ratings </h3>
                <div className="scorefilter">
                  <div className="productScore">
                    <p> {initialScore} out of 5 </p> 
                    <RatingStar score={initialScore} />
                  </div>
                  <div className="scoreSelection">
                    <button> ALL </button>
                    <button> 5 </button>
                    <button> 4 </button>
                    <button> 3 </button>
                    <button> 2 </button>
                    <button> 1 </button>
                  </div>
                </div>
                <div className="productComment">
                  <img src="test"/>
                  <div className="commentInfo">
                    <p> Parn007x </p>
                    <RatingStar score={initialScore} />
                    <p> 2023-10-14 07:41 | 5 out of 5 </p>
                    <p> รองเท้าสวยมากไม่รู้ว่าแท้มั้ยได้มาในราคาที่เหมาะสมคุณภาพดีไซส์ถูกต้องเลิสมาก </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <Footer /> 
        </>
    )
}

export default Product