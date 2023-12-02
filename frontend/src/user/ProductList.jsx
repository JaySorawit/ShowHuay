import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../css/Productlist.css'; // Import CSS file
import Footer from './Footer';
import ReactSlider from 'react-slider';

function ProductList() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(500);
  const [trackColor, setTrackColor] = useState('linear-gradient(to right, orange 0%, transparent 0%)');
  const search = localStorage.getItem('selectedCategory');

  
  const updateTrackColor = (values) => {
    const percent = ((values[0] + values[1]) / 10);
    setTrackColor(`linear-gradient(to right, orange ${percent}%, transparent ${percent}%)`);
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col">
            <div>Filter By</div>
            <label htmlFor="customRange1" className="form-label">
              Price
            </label>
            <ReactSlider
        defaultValue={[min, max]}
        className="slider"
        trackClassName="tracker"
        min={0}
        max={500}
        minDistance={1}
        step={1}
        withTracks={true}
        pearling={true}
        renderThumb={(props) => <div {...props} className="thumb"></div>}
        renderTrack={(props) => <div {...props} className="track" style={{ background: trackColor }}></div>}
        onChange={(values) => {
          setMin(values[0]);
          setMax(values[1]);
          updateTrackColor(values);
        }}
      />
            <div className="Value-Wrapper">
              <p>
                <span>{min}</span>
              </p>
              <p>
                <span>{max}</span>
              </p>
            </div>
          </div>

          <div className="col-9 col-9-gray">
            <div>Search result for  " {search} " </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductList;
