const db = require('../Database/database')

const getFirstName = (req, res) => {

  const sql = 'SELECT * FROM user WHERE user_id = ?';
  
  db.query(sql, [req.params.userId], (error, rows) => {
    if (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (rows.length > 0) {
      res.json(rows[0].fname);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
};

const updateUser = (req, res) => {

  const { firstName, lastName, phoneNumber } = req.body;
  const userId = req.params.userId;
  const sql = 'UPDATE user SET fname = ?, lname = ?, telephone_number = ? WHERE user_id = ?';

  db.query(sql, [firstName, lastName, phoneNumber, userId], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Failed to update user' });
      return;
    }
    console.log('User updated successfully');
    res.status(200).json({ message: 'User updated successfully' });
  });
};

// const addProduct = (req, res) => {
//   const { category_id, product_name, product_description, price, stock_remaining, image_path } = req.body;

//   const INSERT_USER_QUERY = `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`;
//   db.query(INSERT_USER_QUERY, [email, username, password], (err, results) => {
//       if (err) {
//           console.error('Error registering user: ' + err);
//           res.status(500).json({ error: 'Error registering user' });
//           return;
//       }

//       const user = results.insertId;

//       res.status(200).json({
//           status: 'success',
//           message: 'User registered successfully',
//           userId: user.user_id,
//           username: user.username,
//       });
//   });
// };

const queryProducts = (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT * FROM product WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching products:', err);
          res.status(500).json({ error: 'Failed to fetch products' });
          return;
      }
      res.json(results);
  });
};

const deleteProducts = (req, res) => {
  const productId = req.params.productId;

  const deleteQuery = 'DELETE FROM product WHERE product_id = ?';

  db.query(deleteQuery, [productId], (err, results) => {
      if (err) {
          console.error('Error deleting product:', err);
          res.status(500).json({ error: 'Error deleting product' });
          return;
      }

      res.status(200).json({ message: 'Product deleted successfully' });
  });
};

module.exports = { getFirstName, updateUser, queryProducts, deleteProducts };