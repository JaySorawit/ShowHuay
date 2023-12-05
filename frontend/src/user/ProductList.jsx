import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/Productlist.css";
import RatingStar from "./RatingStar";
import Footer from "./Footer";
import ReactSlider from "react-slider";
import { Button, Container } from "react-bootstrap";

function ProductList() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100000);
  const [trackColor, setTrackColor] = useState(
    "linear-gradient(to right, orange 0%, transparent 0%)"
  );
  const search = localStorage.getItem("selectedCategory");

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
 
  const [clickedButton, setClickedButton] = useState(null);

  const handleButtonClick = (score) => {
    setClickedButton(score === clickedButton ? null : score);
  };
  const handleCategoryClick = (category) => {
    // Perform filtering or navigation logic based on the selected category
    console.log(`Selected Category: ${category}`);
    // You can add more complex logic here, like updating state or navigating to a different page
  };

  const categories = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "5",
    "6",
    "7",
    "8",
  ];
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col_1">
            <div className="filterByText">Filter By</div>
            <hr className="divider_productlist" />
            <div className="form-label">Price range</div>
            <ReactSlider
              value={[min, max]}
              className="slider"
              trackClassName="tracker"
              min={0}
              max={100000}
              minDistance={1}
              step={1}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div style={{ marginRight: "10px" }}>Min :</div>
                <input
                  type="number"
                  value={min}
                  onChange={handleMinInputChange}
                  style={{
                    width: "60px",
                    textAlign: "center",
                  }}
                />
                <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                  Max :
                </div>
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
            <div className="buttonContainer">
              <button className={`rating_button ${clickedButton === 5 ? 'active' : ''}`}
          onClick={() => handleButtonClick(5)}>
                <RatingStar score={5} />
              </button>
              <button className={`rating_button ${clickedButton === 4 ? 'active' : ''}`}
          onClick={() => handleButtonClick(4)}>
                <RatingStar score={4} />
                </button>
              <button className={`rating_button ${clickedButton === 3 ? 'active' : ''}`}
          onClick={() => handleButtonClick(3)}>
                <RatingStar score={3} />
                </button>
              <button className={`rating_button ${clickedButton === 2 ? 'active' : ''}`}
          onClick={() => handleButtonClick(2)}>
                <RatingStar score={2} />
                </button>
              <button className={`rating_button ${clickedButton === 1 ? 'active' : ''}`}
          onClick={() => handleButtonClick(1)}>
                <RatingStar score={1} />
              </button>
            </div>
            <button onClick={handleApply} className="applyButton">
              Apply
            </button>
          </div>

          <div className="col_2">
            <div style={{ margin: "10px" }}>
              Search result for " {search} "{" "}
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductList;
