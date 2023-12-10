import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ************************************ Address Modal Component ************************************ */
const AddressModal = ({ addresses, onSelect, onClose }) => {
  return (
    <div>
      <h2>Select an Address</h2>
      <ul>
        {addresses.map((address) => (
          <li key={address.address_id} onClick={() => onSelect(address)}>
            {`${address.address_fname} ${address.address_lname} | ${address.address_telephone_number}`}
            <br />
            {`${address.address_detail}, ${address.district}, ${address.province}, ${address.zipcode}`}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close Modal</button>
    </div>
  );
};
/* ******************************************************************************************** */

/* ************************************ Credit Card Modal Component **************************** */
const CreditCardModal = ({ creditCards, onSelect, onClose }) => {
  return (
    <div>
      <h2>Select a Credit Card</h2>
      <ul>
        {creditCards.map((creditCard) => (
          <li
            key={creditCard.credit_card_id}
            onClick={() => onSelect(creditCard)}
          >
            {`Credit card number : ${maskedCreditCardNumber(
              creditCard.credit_card_number
            )}`}
            <br />
            {`Type : ${creditCard.card_type}`}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close Modal</button>
    </div>
  );
};
/* ******************************************************************************************** */

/* ************************************ Display creadit card property ************************** */
const today = new Date();
const minDate = today.toISOString().slice(0, 7);
const maskedCreditCardNumber = (creditCardNumber) => {
  if (creditCardNumber) {
    const strippedNumber = creditCardNumber.replace(/\s/g, ""); // Remove existing spaces
    const last4Digits = strippedNumber.slice(-4);
    const maskedPart = "X".repeat(strippedNumber.length - 4);
    const formattedNumber = maskedPart.replace(/(.{4})/g, "$1 ").trim();
    return formattedNumber + " " + last4Digits;
  } else {
    return "N/A";
  }
};
/**********************************************************************************************************/

function Payment() {
  /* **************************** Initialize State & define variable **************************** */
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const productInfo = location.state?.productInfo || [];
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);
  const navigate = useNavigate();

  /* ******************************************************************************************** */

  /* ************************************ Fetch product data ************************************ */
  useEffect(() => {
    const fetchProductDetails = async (productInfo) => {
      try {
        const productDetails = await Promise.all(
          productInfo.map(async (product) => {
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
            imagePath: product.image_path,
            price: product.price,
            productId: product.product_id,
            productName: product.product_name,
            quantity: product.quantity,
          }))
        );
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails(productInfo);
  }, [productInfo]);
  /* ******************************************************************************************** */

  /* ************************************ Fetch address data ************************************ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/address/getAddress/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error("Error fetching address:", error.message);
      }
    };

    fetchData();
  }, [userId]);
  /* ******************************************************************************************** */

  /* ************************************ Handle select address ********************************* */
  const defaultAddress = addresses.find(
    (address) => address.address_default === 1
  );
  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  if (!selectedAddress && defaultAddress) {
    setSelectedAddress(defaultAddress);
  }
  /* ******************************************************************************************** */

  /************************************ Fetch creditCard User *************************************/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/creditCard/getCreditCard/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCreditCards(data);
      } catch (error) {
        console.error("Error fetching creditCard:", error.message);
      }
    };

    fetchData();
  }, [userId]);
  /**********************************************************************************************************/

  /************************************ Handle select creditCard *************************************/
  const defaultCreditCard = creditCards.find(
    (creditCard) => creditCard.card_default === 1
  );

  const handleCreditCardChange = () => {
    setIsModalOpen(true);
  };

  const handleCreditCardSelect = (creditCard) => {
    setSelectedCreditCard(creditCard);
    setIsModalOpen(false);
  };

  if (!selectedCreditCard && defaultCreditCard) {
    setSelectedCreditCard(defaultCreditCard);
  }

  /**********************************************************************************************************/


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
    // getCart();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
/* ******************************************************************************************** */


  /* ************************************ Handle place order ************************************ */
  const handlePlaceOrder = async () => {
    try {
      if (!selectedCreditCard) {
        alert("Please select a credit card");
        return;
      }
      if (!selectedAddress) {
        alert("Please select an address");
        return;
      }
  
      const response = await fetch(
        `http://localhost:3000/purchase/placeOrder/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creditCardId: selectedCreditCard.credit_card_id,
            productInfo: productInfo,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log(data);
  
      if (response.status === 200) {
        productInfo.forEach((product) => {
          deleteProduct(product.productId);
        });
        alert("Order placed successfully");
        navigate("/myPurchases");
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
    }
  };
  
  /* ******************************************************************************************** */

  return (
    <>
      <Navbar />
      <Container>
        <Row>
          <Col>
            <h1>Payment</h1>


            <div>
              <h3>Shipping Address:</h3>
              {defaultAddress ? (
                <div key={defaultAddress.address_id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "0 30px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        maxWidth: "500px",
                        fontWeight: "bold",
                      }}
                    >
                      <p>{`${defaultAddress.address_fname} ${defaultAddress.address_lname} | ${defaultAddress.address_telephone_number}`}</p>
                      <p>{`${defaultAddress.address_detail}, ${defaultAddress.district}, ${defaultAddress.province}, ${defaultAddress.zipcode}`}</p>
                    </div>
                    <button onClick={() => handleAddressClick(defaultAddress)}>
                      Change
                    </button>
                  </div>
                  <hr style={{ opacity: "100%", margin: "20px" }} />
                </div>
              ) : (
                <Link to="/myAddress">Add Address</Link>
              )}
              {isModalOpen && (
                <AddressModal
                  addresses={addresses}
                  onSelect={(address) => {
                    setSelectedAddress(address);
                    setIsModalOpen(false);
                  }}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </div>


            <div className="ProductOrder">
              <h3>Products Ordered:</h3>
              <table>
                <thead>
                  <tr>
                    <th style={{ opacity: "0" }}>Product Image</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <img
                          src={product.imagePath}
                          alt={product.productName}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price * product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div className="PaymentMethod">
              <h3>Credit cards information:</h3>
              {defaultCreditCard ? (
                <div key={defaultCreditCard.credit_card_id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "0 30px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        maxWidth: "500px",
                      }}
                    >
                      <p>{`Credit card number : ${maskedCreditCardNumber(
                        defaultCreditCard.credit_card_number
                      )}`}</p>
                      <p>{`Type : ${defaultCreditCard.card_type}`}</p>
                    </div>
                    <button onClick={handleCreditCardChange}>Change</button>
                  </div>
                  <hr style={{ opacity: "100%", margin: "20px" }} />
                </div>
              ) : (
                <Link to="/myCreditCard">Add Credit Cards</Link>
              )}
              {isModalOpen && (
                <CreditCardModal
                  creditCards={creditCards}
                  onSelect={handleCreditCardSelect}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </div>

            

            {/*Payment Detaiils   ฝากทำต่อ Frontend ที่เหลือ*/}
            <div className="paymentDetail">
              <h3>Payment Details:</h3>
              <p> Merchandise Subtotal : </p>
              <p> Voucher : </p>
              <p> Total Amount : </p>
            </div>

            <button type="button" className="btn btn-primary" onClick={handlePlaceOrder}>
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
