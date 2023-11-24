import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button, Container } from 'react-bootstrap';
import '../css/Home.css';
import Promotion from './Promotion';
import "bootstrap/dist/css/bootstrap.min.css";

// Dummy data for photo URLs
const categoryPhotos = {
  Clothes: 'url-to-clothes-photo',
  Shoes: 'url-to-shoes-photo',
  // Add URLs for other categories
};

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    // Perform filtering or navigation logic based on the selected category
    console.log(`Selected Category: ${category}`);
    // You can add more complex logic here, like updating state or navigating to a different page
  };

  const categories = [
    'Clothes',
    'Shoes',
    'Fashion Accessories',
    'Watches & Glasses',
    'Beauty & Personal Care',
    'Pets',
    'Furniture',
    'Home Appliances',
    'Computers & Laptops',
    'Mobile & Gadgets',
    'Tools & Home Improvement',
    'Health & Household',
  ];

  return (
    <>
      <Navbar />
      <Promotion />
      <div className="container" style={{ width: '1170px'}}>
        <h4 style={{color:'#F44C0C', margin:'20px 0px'}}>CATEGORIES</h4>
        <div className="categoryBox">
          {categories.map((category, index) => (
              <Button
                key={index}
                variant={selectedCategory === category ? 'primary' : 'secondary'}
                onClick={() => {
                  setSelectedCategory(category);
                  handleCategoryClick(category);
                }}
              >
                {category}
              </Button>
            ))}
        </div>
        <h4 style={{color:'#F44C0C', margin:'50px 0px 20px 0px'}}>TOP PRODUCTS</h4>
        <div className="TopProductsBox">
          <Button> </Button>
          <Button> </Button>
          <Button> </Button>
          <Button> </Button>
          <Button> </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
