import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/Payment.css";

/* ************************************ Address Modal Component ************************************ */
const AddressModal = ({ addresses, onSelect, onClose }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSelect = (address) => {
    setSelectedAddress(address);
    onSelect(address);
  };

  const handleRadioChange = (event, address) => {
    if (event.target.checked) {
      handleSelect(address);
    }
  };

  console.log(addresses);
  console.log(selectedAddress);

  return (
    <div className="modal">
      <div className="modal-content">
        <h4 style={{ color: "#F44C0C" }}>Select an Address</h4>
        <ul>
          {addresses.map((address) => (
            <div key={address.address_id}>
              <label style={{ display: "flex", gap: "20px" }}>
                <input
                  type="radio"
                  name="address"
                  value={address.address_id}
                  checked={selectedAddress === address}
                  onChange={(event) => handleRadioChange(event, address)}
                />
                <div style={{ margin: "10px" }}>
                  {`${address.address_fname} ${address.address_lname} | ${address.address_telephone_number}`}
                  <br />
                  {`${address.address_detail}, ${address.district}, ${address.province}, ${address.zipcode}`}
                </div>
              </label>
            </div>
          ))}
        </ul>
        <div style={{ display: "flex", justifyContent: "center", gap: "25px" }}>
          <Link to="/myAddress">
            <button className="editBtn" style={{ width: "150px" }}>
              Add Address
            </button>
          </Link>
          <button
            onClick={onClose}
            className="editBtn"
            style={{ width: "150px" }}
          >
            Close{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ******************************************************************************************** */

/* ************************************ Credit Card Modal Component **************************** */
const CreditCardModal = ({ creditCards, onSelect, onClose, selectedCreditCard }) => {
  return (
    <div className="modal">
      <div className="modal-content">
      <h4 style={{ color: "#F44C0C" }}>Select a Credit Card</h4>
      <ul>
        {creditCards.map((creditCard) => (
          <div key={creditCard.credit_card_id}>
            <label style={{ display: "flex", gap: "20px" }}>
              <input
                type="radio"
                name="creditCard"
                value={creditCard.credit_card_id}
                checked={selectedCreditCard && selectedCreditCard.credit_card_id === creditCard.credit_card_id}
                onChange={() => onSelect(creditCard)}
              />
              <div style={{ margin: "10px" }}>
                {`Credit card number : ${maskedCreditCardNumber(
                  creditCard.credit_card_number
                )}`}
                <br />
                {`Type : ${creditCard.card_type}`}
              </div>
            </label>
          </div>
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "center", gap: "25px" }}>
        <Link to="/myCreditCard"><button className="editBtn" style={{ width: "170px" }}>Add Credit Card</button> </Link>
        <button onClick={onClose} className="editBtn" style={{ width: "170px" }}>Close </button>
      </div>
      </div>
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
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const [isModalCreditCardOpen, setIsModalCreditCardOpen] = useState(false);
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

  if (!selectedAddress && defaultAddress) {
    setSelectedAddress(defaultAddress);
  }

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setIsModalAddressOpen(true);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setIsModalAddressOpen(false);
  };

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
    setIsModalCreditCardOpen(true);
  };

  const handleCreditCardSelect = (creditCard) => {
    setSelectedCreditCard(creditCard);
    setIsModalCreditCardOpen(false);
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
        const errorMessage = await response.json();

        if (
          response.status === 400 &&
          errorMessage.error === "Product does not exist"
        ) {
          alert("Product does not exist. Please choose a valid product.");
        } else if (
          response.status === 500 &&
          errorMessage.error === "Failed to check stock"
        ) {
          alert("Failed to check stock. Please try again later.");
        } else if (
          response.status === 400 &&
          errorMessage.error ===
            "Some items are out of stock. Please adjust your quantity."
        ) {
          alert("Some items are out of stock. Please adjust your quantity.");
        } else {
          alert(
            `Error placing order: Some items are out of stock. Please adjust your quantity.`
          );
        }

        return;
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
      console.error(error.message);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  /* ******************************************************************************************** */

  return (
    <>
      <Navbar />
      <div
        className="purchases-container"
        style={{
          backgroundColor: "#F1F0F0",
          minHeight: "640px",
        }}
      >
        <Container
          style={{
            maxWidth: "1080px",
            backgroundColor: "#fff",
            paddingBottom: "30px",
          }}
        >
          <div className="heading pt-4 pl-3 pb-2">
            <h4 style={{ fontSize: "22px" }}>Payment</h4>
          </div>

          <div>
            {selectedAddress || defaultAddress ? (
              <div className="addresses-box">
                <p className="heading-delivery mb-2">Delivery Address</p>
                <Row key={(selectedAddress || defaultAddress).address_id}>
                  <Col md={10}>
                    <p>
                      {`${(selectedAddress || defaultAddress).address_fname} ${
                        (selectedAddress || defaultAddress).address_lname
                      } | ${
                        (selectedAddress || defaultAddress)
                          .address_telephone_number
                      }`}
                    </p>

                    <p>
                      {`${
                        (selectedAddress || defaultAddress).address_detail
                      }, ${(selectedAddress || defaultAddress).district}, ${
                        (selectedAddress || defaultAddress).province
                      }, ${(selectedAddress || defaultAddress).zipcode}`}
                    </p>
                  </Col>
                  <Col md={2} className="text-md-right">
                    <button
                      className="btn-changed-payment"
                      onClick={() =>
                        handleAddressClick(selectedAddress || defaultAddress)
                      }
                    >
                      Change
                    </button>
                  </Col>
                </Row>
              </div>
            ) : (
              <Link to="/myAddress">Add Address</Link>
            )}
            {isModalAddressOpen && (
              <AddressModal
                addresses={addresses}
                onSelect={handleSelectAddress}
                onClose={() => setIsModalAddressOpen(false)}
              />
            )}
          </div>

          <Row className="content-payment">
            <Col className="content-payment-left">
              <div className="ProductOrder">
                <div className="heading-order">
                  <i
                    className="nav-icon fas fa-shopping-cart me-2"
                    style={{ color: "#F44C0C" }}
                  />
                  <span
                    className="heading-delivery mb-2"
                    style={{ fontSize: "16px" }}
                  >
                    Products Ordered
                  </span>
                </div>
                <table
                  style={{ borderCollapse: "separate", borderSpacing: "15px" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}></th>
                      <th style={{ width: "30%" }}>Name</th>
                      <th style={{ width: "20%" }}>Price</th>
                      <th style={{ width: "15%" }}>Quantity</th>
                      <th style={{ width: "25%" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.productId} className="table-row pb-4">
                        <td className="row-product-purchase">
                          <img
                            src={product.imagePath}
                            alt={product.productName}
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td className="row-product-purchase row-product-purchase-name">
                          {product.productName}
                        </td>
                        <td className="row-product-purchase">
                          {product.price}
                        </td>
                        <td className="row-product-purchase">
                          {product.quantity}
                        </td>
                        <td className="row-product-purchase">
                          {product.price * product.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
            <Col className="content-payment-right d-flex flex-column">
              <Row className="content-payment-right-upper mb-3">
                <div className="payment-method">
                  <div className="heading-order">
                    <i
                      className="nav-icon fas fa-credit-card me-2"
                      style={{ color: "#F44C0C" }}
                    />
                    <span
                      className="heading-delivery mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Credit card Information
                    </span>
                  </div>
                  {selectedCreditCard || defaultCreditCard ? (
                    <div
                      key={
                        (selectedCreditCard || defaultCreditCard).credit_card_id
                      }
                      className="credit-card-content"
                    >
                      <div>
                        <p>{`Card number : ${maskedCreditCardNumber(
                          (selectedCreditCard || defaultCreditCard)
                            .credit_card_number
                        )}`}</p>
                        <p>{`Card Type : ${
                          (selectedCreditCard || defaultCreditCard).card_type
                        }`}</p>
                      </div>
                      <div className="text-md-right">
                        <button
                          className="btn-changed-payment"
                          onClick={handleCreditCardChange}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/myCreditCard">Add Credit Cards</Link>
                  )}

                  {isModalCreditCardOpen && (
                    <CreditCardModal
                      creditCards={creditCards}
                      onSelect={handleCreditCardSelect}
                      onClose={() => setIsModalCreditCardOpen(false)}
                    />
                  )}
                </div>
              </Row>
              <Row className="content-payment-right-lower flex-grow-1">
                <div className="paymentDetail">
                  <div className="heading-order">
                    <i
                      className="nav-icon fas fa-file-invoice-dollar me-2"
                      style={{ color: "#F44C0C" }}
                    />
                    <span
                      className="heading-delivery mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Payment Detail
                    </span>
                  </div>
                  <div className="payment-content">
                    <p> Merchandise Subtotal : </p>
                    <p> Voucher : </p>
                    <p> Total Amount : </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-placeorder"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default Payment;
