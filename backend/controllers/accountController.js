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

    if (results.length === 0) {
      res.status(404).json({ error: 'Username not found for the given user ID' });
      return;
    }

    const user = results[0];
    
    // Format the date_of_birth
    const formattedUser = {
      ...user,
      date_of_birth: user.date_of_birth
        ? new Date(user.date_of_birth).toLocaleDateString('en-GB') // Adjust the locale as needed
        : null,
    };

    res.json(formattedUser);
  });
};
/**********************************************************************************************************/

/******************************************* Update user information *******************************************/
const updateUserInfo = (req, res) => {
  const userId = req.params.userId;
  const userinfo = req.body;
  const { username, email, fname, lname, telephoneNumber, gender, dateOfBirth } = userinfo;
  if (userinfo.dateOfBirth == '') {
    userinfo.dateOfBirth = null;
  }

  console.log(userinfo);
  console.log(userinfo.dateOfBirth);

  const query = `
      UPDATE user 
      SET username = ?, email = ?, fname = ?, lname = ?, telephone_number = ?, gender = ?, date_of_birth = ?
      WHERE user_id = ?
    `;

  db.query(
    query,
    [username, email, fname, lname, telephoneNumber, gender, userinfo.dateOfBirth, userId],
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
/***********************************************************************************************************/


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

/********************************** Update Review State in Purchase  *************************************/
const updateReviewState = (req, res) => {
  const purchaseId = req.params.purchaseId;

  const sql = 'UPDATE purchase SET is_review = 1 WHERE purchase_id = ?';
  db.query(sql, [purchaseId], (err, results) => {
    if (err) {
      console.error('Error updating review state:', err);
      res.status(500).json({ error: 'Failed to update review state' });
      return;
    }
    console.log('Review state updated successfully');
    res.status(200).json({ message: 'Review state updated successfully' });
  });
};
/**********************************************************************************************************/

/******************************************** Add Product Review *****************************************/
const AddProductReview = (req, res) => {

  const { product_id, user_id, review_score, review_text } = req.body;

  const sql = 'INSERT INTO product_review (product_id, user_id, review_score, review_text) VALUES (?, ?, ?, ?)';
  db.query(sql, [product_id, user_id, review_score, review_text], (err, results) => {
    if (err) {
      console.error('Error adding product review:', err);
      res.status(500).json({ error: 'Failed to adding product review' });
      return;
    }
    console.log('Product reviewed updated successfully');
    res.status(200).json({ message: 'Product reviewed updated successfully' });
  });
};
/**********************************************************************************************************/

module.exports = { getUserInfo, updateUserInfo, queryUsername, queryPurchases, updateReviewState, AddProductReview };