/********************************************************************
 *   RatingStar.jsx                                                 *
 *                                                                  *
 *   React component representing a star rating system. It allows   *
 *   users to provide feedback by selecting a rating through stars. *
 *   It's commonly used in product reviews and user feedback forms. *
 *                                                                  *
 ********************************************************************/

import React from 'react';

/************************************ Display star from rating  *************************************/
const RatingStar = ({ score }) => {
  const renderStars = () => {
    const roundedScore = Math.round(score);

    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= roundedScore ? '#FF9900' : 'gray' }}>
        ★
      </span>
    ));
  };

  return (
    <div>
      {renderStars()}
    </div>
  );
};
/*****************************************************************************************************/

export default RatingStar;
