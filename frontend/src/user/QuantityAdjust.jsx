import '../css/Product.css';
import React, { useState } from "react";

const QuantityAdjust = ({ stockRemaining }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    if (quantity < stockRemaining) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <div className="quantitybox">
        <p style={{ border: 'none' }}>Quantity</p>
      </div>
      <div className="quantitybutton" style={{ display: 'flex' }}>
        <button onClick={handleDecrease}>-</button>
        <p>{quantity}</p>
        <button onClick={handleIncrease} disabled={quantity === stockRemaining}>
          +
        </button>
      </div>
    </>
  );
};

export default QuantityAdjust;

