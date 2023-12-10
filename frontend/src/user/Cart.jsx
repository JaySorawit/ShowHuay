import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/Cart.css";
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
    <div className="gray-curved-box">
      <div className="item-row">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => handleCheckboxChange(id)}
        />
        <div className="checkbox-divider"></div>
        <div className="item-content">
          <div className="item-image">
            <img src={imagePath} alt="product" />
          </div>
          <div className="item-details">
            {/* <div className="column">
              <h4>{sellerName}</h4>
            </div> */}
            <div className="column">
              <p>Product Name</p>
              <p>{name}</p>
            </div>
            <div className="column">
              <p>Price</p>
              <p>${price}</p>
            </div>
            <div className="column">
              <p>Quantity</p>
              <p>${quantity}</p>
            </div>
            <div className="column">
              <p>Total Price</p>
              <p>${quantity * price}</p>
            </div>
          </div>
        </div>

        <button class='cart-del-button'onClick={() => handleDeleteProduct(id)}>Delete</button>
      </div>
    </div>
  </div>
);




/* ******************************************************************************************** */


const Cart = () => {

  /* **************************** Initialize State & define variable **************************** */
  const userId = localStorage.getItem("userId");
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
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
    const fetchProductDetails = async (cartItems) => {
      try {
        const productDetails = await Promise.all(
          cartItems.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:3000/product/${product.productId}`
              );
              const productData = response.data.product[0];
              return { ...productData, quantity: product.quantity };
            } catch (error) {
              console.error("Error fetching product:", error);
              throw error;
            }
          })
        );
        setProducts(
          productDetails.map((product) => ({
            sellerName: product.username,
            imagePath: product.image_path,
            price: product.price,
            productId: product.product_id,
            productName: product.product_name,
            quantity: product.quantity,
            stockRemaining: product.stock_remaining,
          }))
        );
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails(cartItems);
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
    window.location.reload();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
/* ******************************************************************************************** */


/**************************************** handleCheckout ****************************************/
const handleCheckout = () => {
  if (selectedItems.length === 0) {
    alert("Please select at least one item to checkout");
    return;
  }
  const selectedProducts = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      stockRemaining: item.stockRemaining,
    }));

  const allProductsAvailable = selectedProducts.every(
    (product) =>
      products.find((p) => p.productId === product.productId).stockRemaining >= product.quantity
  );

  if (allProductsAvailable) {
    navigate("/payment", { state: { productInfo: selectedProducts } });
  } else {
    alert("Some products are out of stock. Please adjust your quantity.");
  }
};
/* ******************************************************************************************** */

  return (
    <>
      <Navbar />
      <h1>Cart</h1>
      <Container>
      <Row>

          <Col>
            

            {products.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              products.map((item) => (
                <CartItem
                  key={item.productId}
                  id={item.productId}
                  name={item.productName || "Product Name Unavailable"}
                  price={item.price || "Product price Unavailable"}
                  imagePath={item.imagePath || "Product image Unavailable"}
                  quantity={item.quantity}
                  sellerName={item.sellerName}
                  selected={selectedItems.includes(item.productId)}
                  handleCheckboxChange={handleCheckboxChange}
                  handleDeleteProduct={deleteProduct} 
                />
              ))
            )}
            <button onClick={handleCheckout}>Checkout</button>


          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};


export default Cart;