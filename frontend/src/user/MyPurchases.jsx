import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/MyPurchases.css";

const MyPurchases = () => {
  /************************************** Initialize State ***************************************/
  const [username, setUsername] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [showReviewProductModal, setShowReviewProductModal] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(false);
  const [reviewInfo, setReviewInfo] = useState({
    productId: "",
    userId: "",
    reviewScore: "",
    reviewText: "",
  });
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);
  /***********************************************************************************************/

  /************************************ Query Purchases ******************************************/
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/account/purchases/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const purchaseIds = data.map((purchase) => purchase.purchase_id);
        const purchaseProductRequests = purchaseIds.map((purchaseId) =>
          fetch(`http://localhost:3000/product/purchases/${purchaseId}`).then(
            (response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch products for purchase with ID: ${purchaseId}`
                );
              }
              return response.json();
            }
          )
        );

        Promise.all(purchaseProductRequests)
          .then((productsData) => {
            const purchasesWithProducts = data.map((purchase, index) => ({
              ...purchase,
              products: productsData[index],
            }));
            setFilteredPurchases(purchasesWithProducts);
            console.log(purchasesWithProducts);
          })
          .catch((error) => {
            console.error("Error fetching products for purchases:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, []);

  /***************************************************************************************************/

  /*************************************** Link of Products ******************************************/
  const navigate = useNavigate();
  const handleView = (productId) => {
    navigate(`/products/${productId}`);
  };
  const handleContactSeller = (userId) => {
    navigate(`/chat/${userId}`);
  };
  /***************************************************************************************************/

  /************************************** Toggle System **********************************************/
  const toggleReviewProductModal = () => {
    setShowReviewProductModal(!showReviewProductModal);
  };
  /***************************************************************************************************/

  /*********************************** Handle Review Change ******************************************/
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewInfo({ ...reviewInfo, [name]: value });
  };
  /***************************************************************************************************/

  /************************************** Review Product *********************************************/
  const handleReview = async (purchaseId, productId) => {
    setShowReviewProductModal(true);
    setSelectedPurchaseId(purchaseId);
    setReviewInfo({
      productId: productId,
      userId: localStorage.getItem("userId"),
    });
    setError(false);
    setRating(0);
  };
  /***************************************************************************************************/

  /***************************************** Update Product ******************************************/
  const handleUpdatePurchases = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError(true);
      return;
    }

    try {
      const updateResponse = await fetch(
        `http://localhost:3000/account/review/${selectedPurchaseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewInfo),
        }
      );

      if (updateResponse.ok) {
        console.log("Review state updated successfully");

        try {
          const addReviewResponse = await fetch(
            `http://localhost:3000/account/addReview`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reviewInfo),
            }
          );

          if (addReviewResponse.ok) {
            console.log("Product review added successfully");
            window.location.reload();
          } else {
            console.error("Failed to add product review");
          }
        } catch (addReviewError) {
          console.error(
            "Error occurred while adding product review:",
            addReviewError
          );
        }
      } else {
        console.error("Failed to update review state");
      }
    } catch (updateError) {
      console.error("Error occurred while updating review state:", updateError);
    }
  };
  /***************************************************************************************************/

  /*************************************** Rating star System ****************************************/
  const handleStarClick = (value) => {
    setRating(value);
    setReviewInfo({ ...reviewInfo, reviewScore: value });
    setError(false);
  };
  /***************************************************************************************************/

  const sortedPurchases = [...filteredPurchases].sort(
    (a, b) => b.purchase_id - a.purchase_id
  );

  return (
    <div>
      <Navbar />
      <div
        className="purchases-container"
        style={{
          paddingTop: "35px",
          paddingBottom: "35px",
          backgroundColor: "#F1F0F0",
          minHeight: "640px",
        }}
      >
        <Container style={{ maxWidth: "1080px" }}>
          <div className="heading">
            <h4 style={{ fontSize: "20px" }}>{username}'s Purchases</h4>
          </div>

          <Row>
            <Col md={2}>
              <div>
                <h5 style={{ fontSize: "16px" }}>My Purchases</h5>
              </div>
            </Col>
            <Col md={10}>
              {sortedPurchases.length === 0 ? (
                <div className="no-orders">
                  <div>
                    <i
                      className="nav-icon fas fa-shopping-basket mb-2"
                      style={{ color: "#F44C0C", fontSize: "64px" }}
                    />
                  </div>
                  <p>No orders yet</p>
                </div>
              ) : (
                sortedPurchases.map((purchase) => (
                  <div key={purchase.purchase_id} className="purchase-item">
                    {purchase.products.purchaseDetails.map((product) => (
                      <>
                        <div className="heading-purchases">
                          <i
                            className="nav-icon fas fa-store me-2"
                            style={{ color: "#F44C0C", fontSize: "14px" }}
                          />
                          <span style={{ fontWeight: "500" }}>
                            {product.username}
                          </span>
                          <button
                            className="view-button ms-2"
                            onClick={() => handleView(product.product_id)}
                          >
                            View Page
                          </button>
                        </div>

                        <div className="content-purchases">
                          <Row
                            key={product.product_id}
                            className="rows-content"
                          >
                            <Col md={2}>
                              <img
                                src={product.image_path}
                                alt={product.product_name}
                                className="product-image"
                                style={{ width: "120px", height: "120px" }}
                              />
                            </Col>

                            <Col md={9}>
                              <div>
                                <p className="content-text">
                                  {product.product_name}
                                </p>
                                <p className="content-text">
                                  x{product.quantity}
                                </p>
                              </div>
                            </Col>

                            <Col md={1}>
                              <div className="mt-4">
                                <p
                                  className="content-text"
                                  style={{
                                    color: "#F44C0C",
                                    fontWeight: "500",
                                  }}
                                >
                                  ฿{product.price}
                                </p>
                              </div>
                            </Col>
                            <div className="footer-button">
                              <button
                                className="contact-review-button"
                                onClick={() =>
                                  handleContactSeller(product.user_id)
                                }
                              >
                                Contact Seller
                              </button>
                              {product.is_review === 0 && (
                                <button
                                  className="contact-review-button"
                                  onClick={() =>
                                    handleReview(
                                      purchase.purchase_id,
                                      product.product_id
                                    )
                                  }
                                >
                                  Review
                                </button>
                              )}
                            </div>
                          </Row>
                        </div>
                      </>
                    ))}

                    <div className="footer-purchases">
                      <Row>
                        <Col>
                          <p
                            className="mt-2 text-muted"
                            style={{ fontSize: "12px" }}
                          >
                            Payment time:{" "}
                            {format(
                              new Date(purchase.payment_timestamp),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </p>
                        </Col>
                        <Col>
                          <p className="content-text text-right">
                            Order Total:&nbsp;
                            <span
                              style={{
                                color: "#F44C0C",
                                fontWeight: "500",
                                fontSize: "20px",
                              }}
                            >
                              ฿{purchase.products.purchaseDetails.reduce((totalPrice, product) => totalPrice + product.price, 0)}
                            </span>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ))
              )}
            </Col>
          </Row>
        </Container>
        {showReviewProductModal && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => {
                  toggleReviewProductModal();
                }}
              >
                &times;
              </span>
              <h5 className="add-user-text">Review</h5>
              <Form onSubmit={handleUpdatePurchases}>
                <Form.Group className="form-layout" controlId="reviewScore">
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => {
                      const value = index + 1;
                      return (
                        <div key={index} onClick={() => handleStarClick(value)}>
                          <FaStar
                            className="star"
                            color={value <= rating ? "#ffc107" : "#e4e5e9"}
                            size={30}
                          />
                        </div>
                      );
                    })}
                    {error && (
                      <p className="star-error">Please select a star</p>
                    )}
                  </div>
                </Form.Group>

                <Form.Group className="form-layout" controlId="reviewText">
                  <Form.Control
                    as="textarea"
                    placeholder="Review Description"
                    name="reviewText"
                    value={reviewInfo.reviewText}
                    onChange={handleReviewChange}
                    rows={4}
                    style={{ height: "180px" }}
                    required
                  />
                </Form.Group>

                <div className="form-layout" style={{ marginBottom: "16px" }}>
                  <Button className="btn-submit w-100" type="submit">
                    SUBMIT
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyPurchases;
