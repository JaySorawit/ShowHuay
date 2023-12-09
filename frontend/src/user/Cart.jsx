import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ************************************ Cart Item Component ************************************ */
const CartItem = ({
  id,
  name,
  price,
  quantity,
  imagePath,
  sellerName,
  selected,
  handleCheckboxChange,
  handleDeleteProduct,
}) => (
  <div className="item" key={id}>
    <input
      type="checkbox"
      checked={selected}
      onChange={() => handleCheckboxChange(id)}
    />
    <div className="item-image">
      <img src={imagePath} alt="product" style={{ width: "100px", height: "100px" }} />
    </div>
    <div className="item-details">
      <h4>{sellerName}</h4>
      <h3>{name}</h3>
      <p>ID: {id}</p>
      <p>Price: ${price}</p>
      <p>Quantity: {quantity}</p>
    </div>
    <button onClick={() => handleDeleteProduct(id)}>Delete</button>
  </div>
);
/* ******************************************************************************************** */


const Cart = () => {

  /* **************************** Initialize State & define variable **************************** */
  const userId = localStorage.getItem("userId");
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  /* ******************************************************************************************** */


  /* ************************************ Fetch cart data ************************************ */
  const getCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/cart/getCart/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 204) {
        console.log("Cart is empty");
        setCartItems([]); // Set cart items to an empty array or handle as needed
        return;
      }
  
      const responseData = await response.json();
      console.log(responseData);
  
      const carts = responseData.carts || [];
      setCartItems(
        carts.map((item) => ({
          productId: item.product_id,
          price: item.price,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  
  /* ******************************************************************************************** */


  /* ************************ Fetch cart data on component mount ********************************* */
  useEffect(() => {
    getCart();
  }, []); 
  /* ******************************************************************************************** */
  

  /* ************************************ Fetch product data ************************************ */
  useEffect(() => {
    cartItems.forEach((item) => {
      axios
        .get(`http://localhost:3000/product/${item.productId}`)
        .then(function (response) {
          const productData = response.data.product[0];
          if (productData) {
            setCartItems((prevCartItems) =>
              prevCartItems.map((prevItem) =>
                prevItem.productId === item.productId
                  ? {
                      ...prevItem,
                      productName: productData.product_name,
                      price: productData.price,
                      sellerName: productData.username,
                      imgPath: productData.image_path,
                    }
                  : prevItem
              )
            );
          }
        })
        .catch(function (error) {
          console.error("Error fetching product data:", error);
        });
    });
  }, [cartItems]);
  /* ******************************************************************************************** */

  /* ************************************ Handle when checkbox change *************************** */
  const handleCheckboxChange = (itemId) => {
    const updatedSelection = selectedItems.includes(itemId)
      ? selectedItems.filter((item) => item !== itemId)
      : [...selectedItems, itemId];
    setSelectedItems(updatedSelection);
  };
  /* ******************************************************************************************** */

/* ****************************** Delete product from cart ************************************ */
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/cart/removeFromCart`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
        }),
      }
    );

    const responseData = await response.json();

    // Update cart items after deletion
    getCart();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

const handleCheckout = () => {
  const selectedProducts = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

  // Navigate to the payment page with the selected product information
  // Use state to pass the selected products
  return <Link to="/payment" state={{ productInfo: selectedProducts }}>Checkout</Link>;
};




/* ******************************************************************************************** */

  return (
    <>
      <Navbar />
      <Container>
        <Row>
          <Col>
            <h1>Cart</h1>

            {cartItems.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  id={item.productId}
                  name={item.productName || "Product Name Unavailable"}
                  price={item.price || "Product price Unavailable"}
                  imagePath={item.imgPath || "Product image Unavailable"}
                  quantity={item.quantity}
                  sellerName={item.sellerName}
                  selected={selectedItems.includes(item.productId)}
                  handleCheckboxChange={handleCheckboxChange}
                  handleDeleteProduct={deleteProduct} 
                />
              ))
            )}
            <div>{handleCheckout()}</div>


          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
