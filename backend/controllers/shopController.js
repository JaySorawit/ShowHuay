const db = require('../Database/database')
const path = require('path');
const multer = require('multer');
const fs = require('fs');


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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/product-img/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).single('image_path');

const addProduct = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading file: ' + err);
      res.status(500).json({ error: 'Error uploading file' });
      return;
    }

    const { category_id, product_name, product_description, price, stock_remaining } = req.body;
    const userId = req.params.userId;
    const image_path = req.file ? `../product-img/${req.file.filename}` : null;

    const INSERT_PRODUCT_QUERY = `INSERT INTO product (user_id, category_id, product_name, product_description, price, stock_remaining, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(INSERT_PRODUCT_QUERY, [userId, category_id, product_name, product_description, price, stock_remaining, image_path], (err, results) => {
      if (err) {
        console.error('Error adding product: ' + err);
        res.status(500).json({ error: 'Error adding product' });
        return;
      }

      const productId = results.insertId;

      res.status(200).json({
        status: 'success',
        message: 'Product added successfully',
        productId: productId,
        productName: product_name,
      });
    });
  });
};

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

  const getProductImageQuery = 'SELECT image_path FROM product WHERE product_id = ?';

  db.query(getProductImageQuery, [productId], (err, results) => {
    if (err) {
      console.error('Error retrieving product image:', err);
      res.status(500).json({ error: 'Error retrieving product image' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const imagePath = results[0].image_path;

    const deleteQuery = 'DELETE FROM product WHERE product_id = ?';

    db.query(deleteQuery, [productId], (err, deleteResult) => {
      if (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Error deleting product' });
        return;
      }


      const imagePathToDelete = path.join('../frontend/public/product-img/', imagePath);

      fs.unlink(imagePathToDelete, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }

        res.status(200).json({ message: 'Product deleted successfully' });
      });
    });
  });
};

module.exports = { getFirstName, updateUser, addProduct, queryProducts, deleteProducts };