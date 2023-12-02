import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/Productlist.css";
import Footer from "./Footer";
import ReactSlider from "react-slider";

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
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-3 d-flex align-items-start justify-content-center flex-column">
            <div className="filterByText">Filter By</div>
            <label htmlFor="customRange1" className="form-label">
              Price
            </label>
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
                <div style={{ marginRight: "10px" }}>Min</div>
                <input
                  type="number"
                  value={min}
                  onChange={handleMinInputChange}
                  style={{
                    width: "70px",
                    textAlign: "center",
                  }}
                />
                <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                  Max
                </div>
                <input
                  type="number"
                  value={max}
                  onChange={handleMaxInputChange}
                  style={{
                    width: "70px",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>
            <button onClick={handleApply} className="applyButton">Apply</button>
          </div>

          <div className="col-9 col-9-gray">
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
