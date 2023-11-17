import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import axios from "axios"

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
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
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
            "http://localhost:3000/api/products/" + id
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
            "http://localhost:3000/api/products/color/" + id
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
            "http://localhost:3000/api/products/img/" + id
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
            "http://localhost:3000/api/products/stock/" + id
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

    return (
        <>
        <Navbar/>
        </>
    )
}

export default Product