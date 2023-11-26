import React from 'react'
import Navbar from './Navbar'
import '../css/Productlist.css'; // Import CSS file
import Footer from './Footer';
function ProductList() {
  return (
  <>
  <Navbar/>
  <div class="container">
    <div class="row">
      <div class="col">
        <div>Filter By</div>    
        <label for="customRange1" class="form-label">Price</label>
        <input type="range" class="form-range" id="customRange1"></input>
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
