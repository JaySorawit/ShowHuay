import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container, InputGroup } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/addProductBackground.jpg";

const AddProduct = () => {
  /*********************************** Initialize State ********************************************/
  const [productInfo, setProductInfo] = useState({
    categoryId: "",
    productName: "",
    productDescription: "",
    price: "",
    stockRemaining: "",
    imagePath: null,
  });
  /*************************************************************************************************/

  /************************************* Handle Change *********************************************/
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "imagePath") {
      setProductInfo({ ...productInfo, [name]: e.target.files[0] });
    } else {
      setProductInfo({ ...productInfo, [name]: value });
    }
  };
  /*************************************************************************************************/

  /*************************************** Add Product *********************************************/
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      const formData = new FormData();

      formData.append("categoryId", productInfo.categoryId);
      formData.append("productName", productInfo.productName);
      formData.append("productDescription", productInfo.productDescription);
      formData.append("price", productInfo.price);
      formData.append("stockRemaining", productInfo.stockRemaining);
      formData.append("imagePath", productInfo.imagePath);

      const response = await fetch(
        `http://localhost:3000/shop/addProduct/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Product added successfully");
        window.location.href = "/shop";
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  /*************************************************************************************************/

  return (
    <>
      <Navbar />
      <div
        className="pt-2 pb-3"
        style={{
          backgroundColor: "#F1F0F0",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        <Container className="p-4" style={{ maxWidth: "1080px" }}>
          <Row className="no-gutters">
            <Col
              md={9}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                margin: "auto",
              }}
            >
              <div className="p-4">
                <Link
                  style={{
                    marginLeft: "40px",
                    paddingBottom: "10px",
                    color: "#F44C0C",
                  }}
                  to="/shop"
                >
                  &lt; Back
                </Link>
                <h5
                  className="seller-info mt-2 mb-3"
                  style={{ marginLeft: "40px" }}
                >
                  Add Product
                </h5>
                <Form onSubmit={handleAddProduct}>
                  <Form.Group className="form-layout" controlId="categoryId">
                    <Form.Control
                      as="select"
                      name="categoryId"
                      value={productInfo.categoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="0">Clothes</option>
                      <option value="1">Shoes</option>
                      <option value="2">Fashion Accessories</option>
                      <option value="3">Watches & Glasses</option>
                      <option value="4">Beauty & Personal Care</option>
                      <option value="5">Pets</option>
                      <option value="6">Furniture</option>
                      <option value="7">Home Appliances</option>
                      <option value="8">Computers & Laptops</option>
                      <option value="9">Mobile & Gadgets</option>
                      <option value="10">Tools & Home Improvement</option>
                      <option value="11">Sports & Outdoors</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="form-layout" controlId="productName">
                    <Form.Control
                      type="text"
                      placeholder="Product Name"
                      name="productName"
                      value={productInfo.productName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="form-layout"
                    controlId="productDescription"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Product Description"
                      name="productDescription"
                      value={productInfo.productDescription}
                      onChange={handleChange}
                      rows={4}
                      style={{ height: "120px" }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="form-layout" controlId="price">
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      name="price"
                      value={productInfo.price}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="form-layout"
                    controlId="stockRemaining"
                  >
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      name="stockRemaining"
                      value={productInfo.stockRemaining}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="form-layout" controlId="imagePath">
                    <Form.Label style={{ fontWeight: "400" }}>
                      Product Image
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="imagePath"
                      onChange={handleChange}
                      accept=".jpg, .jpeg, .png"
                      style={{ height: "38px" }}
                      required
                    />
                  </Form.Group>

                  <div className="form-layout" style={{ marginBottom: "16px" }}>
                    <Button className="btn-submit w-100" type="submit">
                      Add Product
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
