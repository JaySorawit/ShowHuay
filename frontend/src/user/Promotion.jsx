/********************************************************************
 *   Promotion.jsx                                                  *
 *                                                                  *
 *   React component representing promotional content or offers     *
 *   within the application. It may include banners, discounts,     *
 *   or information about ongoing promotions to attract users.      *
 *                                                                  *
 ********************************************************************/

import React, { useState, useEffect } from 'react';
import '../App.css';
import '../css/Promotion.css'; 

function Promotion() {
  /****************************** Initialize State *************************************/
  const [promotions, setPromotions] = useState([
    'Promotion : Free Shipping Over ฿500',
    'Promotion : Get 10% Off - Use Coupon Code HAPPY123',
  ]);
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  /*****************************************************************************************/

  /****************************** Change Promotion Text *************************************/
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPromotionIndex(
          (currentPromotionIndex + 1) % promotions.length
        );
        setIsFading(false);
      }, 2000);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentPromotionIndex, promotions.length]);
  /*****************************************************************************************/

  return (
    <div className="promotion">
      <div className={`fade-text ${isFading ? 'fade-out' : 'fade-in'}`}>
        <p>{promotions[currentPromotionIndex]}</p>
      </div>
    </div>
  );
}
/*****************************************************************************************/
export default Promotion;
