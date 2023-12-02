const db = require('../Database/database')

/******************************************* Get user information *******************************************/
const getUserInfo = (req, res) => {
    const userId = req.params.userId;
  
    const query = 'SELECT * FROM user WHERE user_id = ?';
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Failed to fetch user info' });
        return;
      }
      res.json(results[0]);
    });
  };

/**********************************************************************************************************/

/******************************************* Update user information *******************************************/
const updateUserInfo = (req, res) => {
    const userId = req.params.userId;
    const { username, email, password, phone_number, address, city, state, zip_code } = req.body;
  
    const query = `
      UPDATE user 
      SET username = ?, email = ?, password = ?, phone_number = ?, address = ?, city = ?, state = ?, zip_code = ?
      WHERE user_id = ?
    `;
  
    db.query(
      query,
      [username, email, password, phone_number, address, city, state, zip_code, userId],
      (err, results) => {
        if (err) {
          console.error('Error updating user info:', err);
          res.status(500).json({ error: 'Failed to update user info' });
          return;
        }
        res.json(results);
      }
    );
  };
/**********************************************************************************************************/


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

  module.exports = { getUserInfo, updateUserInfo, queryUsername, queryPurchases };