/********************************************************************
 *   QuantityAdjust.jsx                                             *
 *                                                                  *
 *   React component allowing users to adjust the quantity of       *
 *   items, typically used in shopping cart or order-related        *
 *   functionalities. It includes buttons or input fields           *
 *   for increasing or decreasing the quantity of products          *
 *                                                                  *
 ********************************************************************/

import React, { useState, useEffect } from "react";

/************************************ Quantity Adjust  *************************************/
const QuantityAdjust = ({ stockRemaining, quantity: propQuantity, onQuantityChange }) => {
  const [localQuantity, setLocalQuantity] = useState(propQuantity || 1);

  useEffect(() => {
    setLocalQuantity(propQuantity || 1);
  }, [propQuantity]);

  const handleIncrease = () => {
    if (localQuantity < stockRemaining) {
      setLocalQuantity(localQuantity + 1);
      onQuantityChange(localQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity(localQuantity - 1);
      onQuantityChange(localQuantity - 1);
    }
  };
  /******************************************************************************************/
  return (
    <>
      <div className="quantitybox">
        <p style={{ border: 'none' }}>Quantity</p>
      </div>
      <div className="quantitybutton" style={{ display: 'flex' }}>
        <button role="button" onClick={handleDecrease}>
          -
        </button>
        <p>{localQuantity}</p>
        <button
          role="button"
          onClick={handleIncrease}
          disabled={localQuantity === stockRemaining}
        >
          +
        </button>
      </div>
    </>
  );
};

export default QuantityAdjust;
