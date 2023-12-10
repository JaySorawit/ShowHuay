/********************************************************************
 *   Home.jsx                                                       *
 *                                                                  *
 *   React component serving as the main landing page of the        *
 *   website. It includes categories selection, discount code       *
 *   announcements, and navigation to another sections.             *
 *                                                                  *
 ********************************************************************/

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "react-bootstrap";
import "../css/Home.css";
import Promotion from "./Promotion";
import "bootstrap/dist/css/bootstrap.min.css";
import ClothesImage from "../assets/Category/1.png";
import ShoesImage from "../assets/Category/2.png";
import Fashion_AccessoriesImage from "../assets/Category/3.png";
import Watches_GlassesImage from "../assets/Category/4.png";
import Beauty_Personal_CareImage from "../assets/Category/5.png";
import PetsImage from "../assets/Category/6.png";
import FurnitureImage from "../assets/Category/7.png";
import Home_AppliancesImage from "../assets/Category/8.png";
import Computers_LaptopsImage from "../assets/Category/9.png";
import Mobile_GadgetsImage from "../assets/Category/10.png";
import Tools_Home_ImprovementImage from "../assets/Category/11.png";
import Sports_OutdoorsImage from "../assets/Category/12.png";
import { Link } from "react-router-dom";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const handleCategoryClick = (category) => {
    console.log(`Selected Category: ${category}`);
    localStorage.setItem("selectedCategory", category);
  };

  const categories = [
    ["Clothes", ClothesImage],
    ["Shoes", ShoesImage],
    ["Fashion Accessories", Fashion_AccessoriesImage],
    ["Watches & Glasses", Watches_GlassesImage],
    ["Beauty & Personal Care", Beauty_Personal_CareImage],
    ["Pets", PetsImage],
    ["Furniture", FurnitureImage],
    ["Home Appliances", Home_AppliancesImage],
    ["Computers & Laptops", Computers_LaptopsImage],
    ["Mobile & Gadgets", Mobile_GadgetsImage],
    ["Tools & Home Improvement", Tools_Home_ImprovementImage],
    ["Sports & Outdoors", Sports_OutdoorsImage],
  ];
  useEffect(() => {
    fetch(`http://localhost:3000/product`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(async (data) => {
        setProducts(data);
        setFilteredProducts(data);
        setProductCount(data.length);

        const productPromises = data.map(async (product) => {
          try {
            const totalSoldResponse = await axios.get(
              `http://localhost:3000/product/${product.product_id}`
            );
            const totalSold = totalSoldResponse.data.product[0].total_sold;

            const reviewResponse = await axios.get(
              `http://localhost:3000/product/getProductReview/${product.product_id}`
            );

            let averageScore = 0;
            if (reviewResponse.data.review.length > 0) {
              const reviews = reviewResponse.data.review.map((review) => ({
                score: review.review_score,
              }));

              let totalScore = 0;
              reviews.forEach((review) => {
                totalScore += review.score;
              });
              averageScore = totalScore / reviews.length;
            }

            return {
              ...product,
              total_sold: totalSold,
              review_score: Math.round(averageScore),
            };
          } catch (error) {
            return {
              ...product,
              total_sold: 0,
              review_score: 0,
            };
          }
        });

        const updatedProducts = await Promise.all(productPromises);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });
  return (
    <>
      <Navbar />
      <Promotion />
      <div className="container" style={{ width: "1170px" }}>
        <h4 style={{ color: "#F44C0C", margin: "20px 0px" }}>CATEGORIES</h4>
        <div className="categoryBox">
          {categories.map((category, index) => (
            <Link key={index} to={`/productlist/${index}`}>
              <Button
                className="home_button"
                key={index}
                variant={
                  selectedCategory === category[0] ? "primary" : "secondary"
                }
                onClick={() => {
                  setSelectedCategory(category[0]);
                  handleCategoryClick(category[0]);
                }}
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {category[1] && (
                  <img
                    className=""
                    src={category[1]}
                    alt={category[0]}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                <span
                  style={{
                    color: "black",
                    marginTop: "15px",
                    fontSize: "14px",
                  }}
                >
                  {category[0]}
                </span>
              </Button>
            </Link>
          ))}
        </div>
        <h4 style={{ color: "#F44C0C", margin: "50px 0px 20px 0px" }}>
          TOP PRODUCTS
        </h4>
        <div className="TopProductsBox">
          {products.slice(0, 5).map((product, index) => (
            <Link
              key={index}
              to={`/Products/${product.product_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button
                style={{
                  margin: "10px",
                  height: "200px",
                  width: "180px",
                  border: "1px solid #000",
                  overflow: "hidden",
                  color: "white",
                  padding: "10px",
                  borderRadius: "0",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0px 0px 10px 3px rgba(0, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src={product.image_path}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -60%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: "14px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    zIndex: "1",
                    transform: "translate(-30%, -285%)",
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, 190%)",
                    color: "black",
                    marginTop: "10px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    padding: "5px",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  Sold: {product.total_sales}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
