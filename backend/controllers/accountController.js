const db = require('../Database/database')

/************************************** Query Username with Product ID  *************************************/
const queryUsername = (req, res) => {
  const productId = req.params.productId;
  const query = `
    SELECT u.username 
    FROM product AS p 
    INNER JOIN user AS u ON p.user_id = u.user_id 
    WHERE p.product_id = ?
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching username:', err);
      res.status(500).json({ error: 'Failed to fetch username' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Username not found for the given product ID' });
      return;
    }
    res.json(results[0]);
  });
};
/**********************************************************************************************************/


/******************************************** Query Purchases  *********************************************/
const queryPurchases = (req, res) => {
    const userId = req.params.userId;
  
    const query = 'SELECT * FROM purchase WHERE user_id = ?';
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching purchases:', err);
        res.status(500).json({ error: 'Failed to fetch purchases' });
        return;
      }
      res.json(results);
    });
  };
  /**********************************************************************************************************/

  module.exports = { queryUsername, queryPurchases };