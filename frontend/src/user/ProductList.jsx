import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/Productlist.css";
import RatingStar from "./RatingStar";
import Footer from "./Footer";
import ReactSlider from "react-slider";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ProductList() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100000);
  const [trackColor, setTrackColor] = useState(
    "linear-gradient(to right, orange 0%, transparent 0%)"
  );
  const updateTrackColor = (values) => {
    const percent = (values[0] + values[1]) / 10;
    setTrackColor(
      `linear-gradient(to right, orange ${percent}%, transparent ${percent}%)`
    );
  };

  const handleMinInputChange = (e) => {
    const inputMin = parseInt(e.target.value);
    setMin(inputMin);
    if (inputMin > max) {
      setMax(inputMin);
    }
  };

  const handleMaxInputChange = (e) => {
    const inputMax = parseInt(e.target.value);
    setMax(inputMax);
    if (inputMax < min) {
      setMin(inputMax);
    }
  };
  const handleApply = () => {
    console.log("Apply clicked! Min:", min, " Max:", max);
  };
  const [isPriceClicked, setIsPriceClicked] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);

  const handleButtonClick = (score) => {
    setClickedButton(score === clickedButton ? null : score);
  };

  const handleSortButtonClick = (value) => {
    setClickedButton(clickedButton === value ? null : value);
  };
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const { categoryId } = useParams();
  const { searchKey } = useParams();
  console.log("key", searchKey);
  console.log("Id", categoryId);
  console.log("key", searchKey == null);
  console.log("Id", categoryId == null);
  const categories = [
    ["Clothes"],
    ["Shoes"],
    ["Fashion Accessories"],
    ["Watches & Glasses"],
    ["Beauty & Personal Care"],
    ["Pets"],
    ["Furniture"],
    ["Home Appliances"],
    ["Computers & Laptops"],
    ["Mobile & Gadgets"],
    ["Tools & Home Improvement"],
    ["Sports & Outdoors"],
  ];
  /********************************* Query Information Product ***********************************/
  let path = `http://localhost:3000/list/productlist/keyword/${searchKey}`;
  let p,
    search = searchKey;
  if (searchKey == null) {
    path = `http://localhost:3000/list/productlist/${categoryId}`;
    p = categoryId;
    search = "Category " + categories[categoryId];
  }

  useEffect(() => {
    fetch(path)
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
        console.log(p);
        const productPromises = data.map(async (product) => {
          try {
            const totalSoldResponse = await axios.get(
              `http://localhost:3000/product/${product.product_id}`
            );

            let imagePath = totalSoldResponse.data.product[0].image_path;
            if (searchKey !== null) {
              imagePath = `../${imagePath}`;
            }

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
              image_path: imagePath,
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
        if (clickedButton === "Top Sales") {
          updatedProducts.sort((a, b) => b.total_sold - a.total_sold);
        }
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
      
  }, [p, clickedButton]);

  /*************************************************************************************************/

  /*************************************  Product list Page  ***************************************/
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredProducts.length / productsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  /*************************************************************************************************/

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col_1">
            <div className="filterByText">Filter By</div>
            <hr className="divider_productlist" />
            <div className="form-label">Price</div>
            <ReactSlider
              value={[min, max]}
              className="slider"
              trackClassName="tracker"
              min={0}
              max={100000}
              minDistance={1}
              step={100}
              withTracks={true}
              pearling={true}
              renderThumb={(props) => <div {...props} className="thumb"></div>}
              renderTrack={(props) => <div {...props} className="track"></div>}
              onChange={(values) => {
                setMin(values[0]);
                setMax(values[1]);
                updateTrackColor(values);
              }}
            />
            <div className="Value-Wrapper">
              <div className="show_min_max">
                <div>Min</div>
                <input
                  type="number"
                  value={min}
                  onChange={handleMinInputChange}
                  style={{
                    width: "60px",
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="show_min_max">
                <div>Max</div>
                <input
                  type="number"
                  value={max}
                  onChange={handleMaxInputChange}
                  style={{
                    width: "60px",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>
            <hr className="divider_productlist" />
            <div className="form-label">Score rating</div>
            <div className="buttonContainer">
              <button
                className={`rating_button ${
                  clickedButton === 5 ? "active" : ""
                }`}
                onClick={() => handleButtonClick(5)}
              >
                <RatingStar score={5} />
              </button>
              <button
                className={`rating_button ${
                  clickedButton === 4 ? "active" : ""
                }`}
                onClick={() => handleButtonClick(4)}
              >
                <RatingStar score={4} />
              </button>
              <button
                className={`rating_button ${
                  clickedButton === 3 ? "active" : ""
                }`}
                onClick={() => handleButtonClick(3)}
              >
                <RatingStar score={3} />
              </button>
              <button
                className={`rating_button ${
                  clickedButton === 2 ? "active" : ""
                }`}
                onClick={() => handleButtonClick(2)}
              >
                <RatingStar score={2} />
              </button>
              <button
                className={`rating_button ${
                  clickedButton === 1 ? "active" : ""
                }`}
                onClick={() => handleButtonClick(1)}
              >
                <RatingStar score={1} />
              </button>
            </div>
            <hr className="divider_productlist" />
            <button onClick={handleApply} className="applyButton">
              Apply
            </button>
          </div>

          <div className="col_2">
            <div className="search_result_word">
              Search result for " {search} "
            </div>
            <div
              className="pt-3 pb-3"
              style={{ backgroundColor: "#F1F0F0", minHeight: "640px" }}
            >
              <Container style={{ maxWidth: "1080px" }}>
                {productCount === 0 ? (
                  <div className="no-products">
                    <div>
                      <i
                        className="nav-icon fas fa-shopping-basket mb-2"
                        style={{ color: "#F44C0C", fontSize: "64px" }}
                      />
                    </div>
                    <p>No products available</p>
                  </div>
                ) : (
                  <><div className="sort-box">
                  <div className="sorting_word">Sort by</div>
                  <button
                    className={`sort-button1 ${
                      clickedButton === "Latest" ? "active" : ""
                    }`}
                    onClick={() => handleSortButtonClick("Latest")}
                  >
                    Latest
                  </button>
                  <button
                    className={`sort-button1 ${
                      clickedButton === "Top Sales" ? "active" : ""
                    }`}
                    onClick={() => handleSortButtonClick("Top Sales")}
                  >
                    Top Sales
                  </button>
                  <button
                    className={`sort-button2 ${isPriceClicked ? "active" : ""}`}
                    onClick={() => {
                      setIsPriceClicked(!isPriceClicked);
                    }}
                  >
                    Price{" "}
                    <span className="arrow">{isPriceClicked ? "↓" : "↑"}</span>
                  </button>
                  <div className="page-button">
                    <button
                      className="current-page"
                      onClick={() => handlePageChange(currentPage)}
                      disabled
                    >
                      {currentPage} /{" "}
                      {Math.ceil(filteredProducts.length / productsPerPage)}
                    </button>
                    <button
                      className="previos-next-button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    <button
                      className="previos-next-button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredProducts.length / productsPerPage)
                      }
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                    <div
                      className="row-card row-cols-2 row-cols-md-4 g-3"
                      style={{ marginTop: 5 }}
                    >
                      {currentProducts.map((product) => (
                        <div key={product.product_id} className="col mb-4">
                          <Link
                            to={`/Products/${product.product_id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <div className="product-card">
                              <img
                                src={product.image_path}
                                alt={product.product_name}
                                className="product-card-image"
                              />
                              <div className="product-card-details">
                                <h5 className="product-card-title">
                                  {product.product_name}
                                </h5>
                                <p className="product-card-info">
                                  ฿{product.price}
                                </p>
                                <div className="product-card-footer">
                                  <RatingStar score={product.review_score} />
                                  <p className="product-card-sold">
                                    {product.total_sold} sold
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Container>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductList;
