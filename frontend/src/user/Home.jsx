import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button, Container } from 'react-bootstrap';
import '../css/Home.css';
import Promotion from './Promotion';
import "bootstrap/dist/css/bootstrap.min.css";
import ClothesImage from '../assets/Category/1.png';
import ShoesImage from '../assets/Category/2.png';
import Fashion_AccessoriesImage from '../assets/Category/3.png';
import Watches_GlassesImage from '../assets/Category/4.png';
import Beauty_Personal_CareImage from '../assets/Category/5.png';
import PetsImage from '../assets/Category/6.png';
import FurnitureImage from '../assets/Category/7.png';
import Home_AppliancesImage from '../assets/Category/8.png';
import Computers_LaptopsImage from '../assets/Category/9.png';
import Mobile_GadgetsImage from '../assets/Category/10.png';
import Tools_Home_ImprovementImage from '../assets/Category/11.png';
import Sports_OutdoorsImage from '../assets/Category/12.png';
import { Link } from 'react-router-dom';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    console.log(`Selected Category: ${category}`);
    localStorage.setItem('selectedCategory', category);
  };
  
  const categories = [
    ['Clothes',ClothesImage],
    ['Shoes',ShoesImage],
    ['Fashion Accessories',Fashion_AccessoriesImage],
    ['Watches & Glasses',Watches_GlassesImage],
    ['Beauty & Personal Care',Beauty_Personal_CareImage],
    ['Pets',PetsImage],
    ['Furniture',FurnitureImage],
    ['Home Appliances',Home_AppliancesImage],
    ['Computers & Laptops',Computers_LaptopsImage],
    ['Mobile & Gadgets',Mobile_GadgetsImage],
    ['Tools & Home Improvement',Tools_Home_ImprovementImage],
    ['Sports & Outdoors',Sports_OutdoorsImage],
  ];

  return (
    <>
      <Navbar />
      <Promotion />
      <div className="container" style={{ width: '1170px'}}>
        <h4 style={{color:'#F44C0C', margin:'20px 0px'}}>CATEGORIES</h4>
        <div className="categoryBox">
          {categories.map((category, index) => (
            <Link
            key={index}
            to={`/productlist/`} 
          >
            <Button
            className='home_button'
            key={index}
            variant={selectedCategory === category[0] ? 'primary' : 'secondary'}
            onClick={() => {
              setSelectedCategory(category[0]);
              handleCategoryClick(category[0]);
            }}
            style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          > 
            
            {category[1] && (            
                             
              <img
                className=''
                src={category[1]}
                alt={category[0]}
                style={{ width: '100px', height: '100px'}}
              />                                         
            )}   
            <span style={{ color: 'black', marginTop: '15px', fontSize: '14px' }}>{category[0]}</span>                  
          </Button>
          </Link>
            
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
