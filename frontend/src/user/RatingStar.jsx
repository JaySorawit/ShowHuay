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
      {/* <p>Rating:</p> */}
      {renderStars()}
      {/* <p>Score: {score}</p> */}
    </div>
  );
};
/*****************************************************************************************************/

export default RatingStar;
