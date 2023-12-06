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
    product_id: "",
    user_id: "",
    review_score: "",
    review_text: "",
  });
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);
  /***********************************************************************************************/

  /************************************* Query Purchases ********************************************/
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
        setPurchases(data);
        const productIds = data.map((purchase) => purchase.product_id);

        const productDetailsRequests = productIds.map((productId) =>
          fetch(`http://localhost:3000/product/${productId}`).then(
            (response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch product with ID: ${productId}`
                );
              }
              return response.json();
            }
          )
        );

        const usernameRequests = productIds.map((productId) =>
          fetch(`http://localhost:3000/account/username/${productId}`).then(
            (response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch username for product with ID: ${productId}`
                );
              }
              return response.json();
            }
          )
        );

        Promise.all([...productDetailsRequests, ...usernameRequests])
          .then((results) => {
            const productsData = results.slice(0, productIds.length);
            const usernamesData = results.slice(productIds.length);

            const purchasesWithProducts = data.map((purchase, index) => ({
              ...purchase,
              productDetails: productsData[index].product[0],
              username: usernamesData[index].username,
            }));
            setFilteredPurchases(purchasesWithProducts);
          })
          .catch((error) => {
            console.error("Error fetching product or username details:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, []);
  /***************************************************************************************************/

  /************************************** Link of Products ******************************************/
  const navigate = useNavigate();
  const handleView = (productId) => {
    navigate(`/products/${productId}`);
  };
  const handleContactSeller = (userId) => {
    navigate(`/chat/${userId}`);
  };
  /******************************************************************************************************/

  /************************************* Toggle System **********************************************/
  const toggleReviewProductModal = () => {
    setShowReviewProductModal(!showReviewProductModal);
  };
  /*************************************************************************************************/

  /************************************* Handle Review Change **********************************************/
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewInfo({ ...reviewInfo, [name]: value });
  };
  /**********************************************************************************************************/

  /******************************************* Review Product ************************************************/
  const handleReview = async (purchaseId, productId) => {
    setShowReviewProductModal(true);
    setSelectedPurchaseId(purchaseId);
    setReviewInfo({
      product_id: productId,
      user_id: localStorage.getItem("userId"),
    });
    setError(false);
    setRating(0);
  };
  /**********************************************************************************************************/

  /******************************************* Update Product **********************************************/
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
  /*************************************************************************************************/

  /**************************************** Rating star System *******************************************/
  const handleStarClick = (value) => {
    setRating(value);
    setReviewInfo({ ...reviewInfo, review_score: value });
    setError(false);
  };
  /*******************************************************************************************************/

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
                  <Row key={purchase.purchase_id} className="purchase-item">
                    <div>
                      {purchase.username && (
                        <div className="heading-purchases">
                          <i
                            className="nav-icon fas fa-store me-2"
                            style={{ color: "#F44C0C", fontSize: "14px" }}
                          />
                          <span style={{ fontWeight: "500" }}>
                            {purchase.username}
                          </span>
                          <button
                            className="view-button ms-2"
                            onClick={() => handleView(purchase.product_id)}
                          >
                            View Page
                          </button>
                        </div>
                      )}
                      {purchase.productDetails && (
                        <div className="content-purchases">
                          <Row>
                            <Col md={2}>
                              <img
                                src={purchase.productDetails.image_path}
                                alt={purchase.productDetails.product_name}
                                className="product-image"
                                style={{ width: "120px", height: "120px" }}
                              />
                            </Col>

                            <Col md={9}>
                              <div>
                                <p className="content-text">
                                  {purchase.productDetails.product_name}
                                </p>
                                <p className="content-text">
                                  x{purchase.quantity}
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
                                  ฿{purchase.productDetails.price}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}

                      {purchase.productDetails && (
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
                                  ฿
                                  {purchase.productDetails.price *
                                    purchase.quantity}
                                </span>
                              </p>
                            </Col>
                          </Row>

                          <div className="footer-button">
                            <button
                              className="contact-review-button"
                              onClick={() =>
                                handleContactSeller(
                                  purchase.productDetails.user_id
                                )
                              }
                            >
                              Contact Seller
                            </button>
                            {purchase.is_review === 0 && (
                              <button
                                className="contact-review-button"
                                onClick={() =>
                                  handleReview(
                                    purchase.purchase_id,
                                    purchase.productDetails.product_id
                                  )
                                }
                              >
                                Review
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Row>
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
                <Form.Group className="form-layout" controlId="review_score">
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

                <Form.Group className="form-layout" controlId="review_text">
                  <Form.Control
                    as="textarea"
                    placeholder="Review Description"
                    name="review_text"
                    value={reviewInfo.review_text}
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
