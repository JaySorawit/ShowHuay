import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Don't forget to import axios
import Navbar from './Navbar';
import Footer from './Footer';

function Payment() {
    const { productInfo } = useParams();
    // const [products, setProducts] = useState([]);

    useEffect(() => {
        if (productInfo) {
          try {
            const productIdArray = JSON.parse(decodeURIComponent(productInfo));
            console.log('Product IDs:', productIdArray);
            // Now you can do something with productIdArray
          } catch (error) {
            console.error('Error parsing productInfo:', error);
          }
        }
      }, [productInfo]);
    
    // console.log('Component is mounting. Product Info:', productInfo);
    // useEffect(() => {
    //     if (productInfo) {
    //       const productIdArray = JSON.parse(decodeURIComponent(productInfo));
    //       console.log('Product IDs:', productIdArray);
      
    //       if (productIdArray.length > 0) {
    //         fetchProductDetails(productIdArray);
    //       } else {
    //         console.log('Product IDs array is empty.');
    //       }
    //     }
    //   }, [productInfo]);
      
    //   const fetchProductDetails = async (productIdArray) => {
    //     console.log('Product IDss:', productIdArray);
    //     try {
    //       const productDetails = await Promise.all(
    //         productIdArray.map(async (product) => {
    //           try {
    //             const response = await axios.get(`http://localhost:3000/product/${product.productId}`);
    //             const productData = response.data.product[0];
    //             console.log('Fetched Product:', productData);
    //             return { ...productData, quantity: product.quantity };
    //           } catch (error) {
    //             console.error('Error fetching product:', error);
    //             throw error; // Rethrow the error to be caught by the outer catch block
    //           }
    //         })
    //       );
      
    //       console.log('Product Details:', productDetails);
      
    //       setProducts(productDetails);
    //     } catch (error) {
    //       console.error('Error fetching product details:', error);
    //     }
    //   };
      
  
    // console.log('Products:', products);
  
    return (
        <>
        <Navbar />
        <Container>
          <Row>
            <Col>
              <h1>Payment</h1>
              <h3>Product Information:</h3>
              {/* <ul>
                {products.map((product) => (
                  <li key={product.productId}>
                    {product.productName} - Quantity: {product.quantity}
                  </li>
                ))}
              </ul> */}
            </Col>
            <Col>
              <button type="button" className="btn btn-primary">
                Place Order
              </button>
            </Col>
          </Row>
        </Container>
        <Footer />
      </>
    );
  }
  
export default Payment;
