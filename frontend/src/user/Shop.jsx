/********************************************************************
 *   Shop.jsx                                                       *
 *                                                                  *
 *   This page is serving as the main view for the shopping         *
 *   section of the application. It typically displays a selection  *
 *   of products, categories, and options for user interaction.     *
 *                                                                  *
 ********************************************************************/

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/shopBackground.png";
import "../css/Shop.css";

const Shop = () => {
  /*********************************** Initialize State *********************************************/
  const [sellerInfo, setSellerInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [productInfo, setProductInfo] = useState({
    productName: "",
    productDescription: "",
    price: "",
    stockRemaining: "",
  });
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  /**************************************************************************************************/

  /*************************************** Seller Context *******************************************/
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `http://localhost:3000/shop/userInfo/${userId}`
        );
        const userData = await response.json();

        if (userData !== null) {
          setSellerInfo(userData);
          setIsSeller(true);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);
  /**************************************************************************************************/

  /************************************* Handle User Change *****************************************/
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setSellerInfo({ ...sellerInfo, [name]: value });
  };
  /**************************************************************************************************/

  /**************************************** Update User *********************************************/
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:3000/shop/updateUser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sellerInfo),
        }
      );

      if (response.ok) {
        console.log("User updated successfully");
        window.location.reload();
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  /*************************************************************************************************/

  /************************************ Form for not Seller ****************************************/
  const renderUserInfoForm = () => {
    return (
      <>
        <Navbar />
        <div className="pt-5 pb-5" style={{ backgroundColor: "#F44C0C", minHeight: "640px" }}>
          <Container className="p-4" style={{ maxWidth: "1080px" }}>
            <Row className="no-gutters">
              <Col
                md={5}
                style={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
              >
                <div className="p-4 pt-5 pb-5">
                  <h5
                    className="seller-info mb-4"
                    style={{ marginLeft: "40px" }}
                  >
                    Register as a ShowHuay Seller
                  </h5>

                  <Form onSubmit={handleUpdateUser}>
                    <Form.Group className="form-layout" controlId="firstName">
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={sellerInfo.firstName}
                        onChange={handleUserChange}
                        maxLength="10"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="form-layout" controlId="lastName">
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={sellerInfo.lastName}
                        onChange={handleUserChange}
                        maxLength="20"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="form-layout" controlId="phoneNumber">
                      <Form.Control
                        type="tel"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        value={sellerInfo.phoneNumber}
                        onChange={handleUserChange}
                        maxLength="10"
                        required
                      />
                    </Form.Group>

                    <div
                      className="form-layout"
                      style={{ marginBottom: "16px" }}
                    >
                      <Button className="btn-submit w-100" type="submit">
                        Register
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>
              <Col
                md={7}
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundColor: "#F44C0C",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </>
    );
  };
  /*************************************************************************************************/

  /*************************************** Query Products ******************************************/
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/shop/products/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  /*************************************************************************************************/

  /************************************** Search Products ******************************************/
  useEffect(() => {
    const results = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  /*************************************************************************************************/

  /************************************ View Page of Products **************************************/
  const navigate = useNavigate();
  const handleView = (productId) => {
    navigate(`/products/${productId}`);
  };
  const handleAdd = () => {
    navigate(`/AddProduct`);
  };
  /*************************************************************************************************/

  /************************************* Delete Products *******************************************/
  const handleDelete = (productId) => {
    fetch(`http://localhost:3000/shop/deleteProducts/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const updatedProducts = products.filter(
          (product) => product.product_id !== productId
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);

        window.alert("Product deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };
  /*************************************************************************************************/

  /************************************* Toggle System *********************************************/
  const toggleEditProductModal = () => {
    setShowEditProductModal(!showEditProductModal);
  };
  /*************************************************************************************************/

  /********************************** Handle Product Change ****************************************/
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductInfo({ ...productInfo, [name]: value });
  };
  /*************************************************************************************************/

  /**************************************** Edit Product *******************************************/
  const handleEdit = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/shop/getProduct/${productId}`
      );
      if (response.ok) {
        const productData = await response.json();
        setProductInfo({
          productName: productData.product_name,
          productDescription: productData.product_description,
          price: productData.price,
          stockRemaining: productData.stock_remaining,
        });
        setShowEditProductModal(true);
        setSelectedProductId(productId);
      } else {
        console.error("Failed to fetch product data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  /*************************************************************************************************/

  /*************************************** Update Product ******************************************/
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/shop/updateProduct/${selectedProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productInfo),
        }
      );

      if (response.ok) {
        console.log("Product updated successfully");
        window.location.reload();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  /*************************************************************************************************/

  return (
    <div>
      {!isSeller ? (
        renderUserInfoForm()
      ) : (
        <>
          <Navbar />
          <div
            className="pt-3 pb-3"
            style={{ backgroundColor: "#F1F0F0", minHeight: "640px" }}
          >
            <Container className="p-4" style={{ maxWidth: "1080px" }}>
              <h4>Products</h4>

              <div>
                <button
                  className="add-product-button"
                  onClick={() => handleAdd()}
                >
                  Add Product
                </button>
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                  style={{ marginLeft: '15px' }}
                />
              </div>

              {filteredProducts.map((product) => (
                <Row key={product.product_id} className="mt-4 product-row">
                  <Col md={4}>
                    <img
                      src={product.image_path}
                      alt={product.product_name}
                      className="product-image"
                    />
                  </Col>
                  <Col md={8} className="ps-md-0 d-flex align-items-center">
                    <div className="product-details ms-3">
                      <h5 className="product-title">{product.product_name}</h5>
                      <p className="product-description">
                        {product.product_description}
                      </p>
                      <p className="product-info">Price: ฿{product.price}</p>
                      <p className="product-info">
                        Stock remaining: {product.stock_remaining}
                      </p>
                      <div className="view-edit-delete-buttons">
                        <button onClick={() => handleView(product.product_id)}>
                          View Page
                        </button>
                        <button onClick={() => handleEdit(product.product_id)}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.product_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </Container>
            {showEditProductModal && (
              <div className="modal">
                <div className="modal-content">
                  <span
                    className="close"
                    onClick={() => {
                      toggleEditProductModal();
                    }}
                  >
                    &times;
                  </span>
                  <h5 className="add-user-text">Edit Product</h5>
                  <Form onSubmit={handleUpdateProduct}>
                    <Form.Group className="form-layout" controlId="productName">
                      <Form.Label style={{ fontWeight: "400" }}>
                        Product Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Product Name"
                        name="productName"
                        value={productInfo.productName}
                        onChange={handleProductChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group
                      className="form-layout"
                      controlId="productDescription"
                    >
                      <Form.Label style={{ fontWeight: "400" }}>
                        Product Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Product Description"
                        name="productDescription"
                        value={productInfo.productDescription}
                        onChange={handleProductChange}
                        rows={4}
                        style={{ height: "120px" }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="form-layout" controlId="price">
                      <Form.Label style={{ fontWeight: "400" }}>
                        Price
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Price"
                        name="price"
                        value={productInfo.price}
                        onChange={handleProductChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      className="form-layout"
                      controlId="stockRemaining"
                    >
                      <Form.Label style={{ fontWeight: "400" }}>
                        Stock Remaining
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Quantity"
                        name="stockRemaining"
                        value={productInfo.stockRemaining}
                        onChange={handleProductChange}
                        required
                      />
                    </Form.Group>

                    <div
                      className="form-layout"
                      style={{ marginBottom: "16px" }}
                    >
                      <Button className="btn-submit w-100" type="submit">
                        Save
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Shop;
