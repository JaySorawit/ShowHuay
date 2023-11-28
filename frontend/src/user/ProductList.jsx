import React, { useState , useEffect} from 'react'
import Navbar from './Navbar'
import '../css/Productlist.css'; // Import CSS file
import Footer from './Footer';
import ReactSlider from 'react-slider';

function ProductList() {
  const [min,setMin] = useState(0);
  const [max,setMax] = useState(500);

  return (
  <>
  <Navbar/>
  <div class="container">
    <div class="row">
      <div class="col">
        
        <div>Filter By</div>    
        <label for="customRange1" class="form-label">Price</label>
        <ReactSlider 
          defaultValue={[min,max]}
          className="slider"
          trackClassName="tracker"
          min={0}
          max={500000}
          minDistance={1}
          step={1}
          withTracks={true}
          pearling={true}
          renderThumb={(props)=> {
            return <div {...props} className="thumb"></div>;
          }}
          renderTrack={(props)=> {
            return <div {...props} className="track"></div>;
          }}
          onChange={([min,max])=>{
            setMin(min);
            setMax(max);
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
        
        <div>Search result for</div>     
      </div>
    
    </div>
  </div>
  <Footer />
  </>
  )
}

export default ProductList
