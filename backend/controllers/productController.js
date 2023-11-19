const db = require('../Database/database')

const addProduct = (req,res) => {
    const { productId, userId, categoryId, productName, productDesciption, price, stockRemaining } = req.body;

    const INSERT_PRODUCT_QUERY = `INSERT INTO product (
        product_id, 
        user_id, 
        category_id, 
        product_name, 
        product_desciption, 
        price, stock_Remaining) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(INSERT_PRODUCT_QUERY, [productId, userId, categoryId, productName, productDesciption, price, stockRemaining], (err, results) => {
        if (err) {
            console.error('Error registering user: ' + err);
            res.status(500).json({ error: 'Error Add Product' });
            return;
        }

        const userId = results.insertId;

        res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
            userId: userId,
        });
    });
}

const getOneProduct = (req, res) => {
    const productId = req.params.id;
  
    const GET_PRODUCT_QUERY = `SELECT * FROM product WHERE product_id = ?;`;
  
    db.query(GET_PRODUCT_QUERY, [productId], (err, results) => {
      if (err) {
        console.error('Error getting product: ' + err);
        res.status(500).json({ error: 'Error getting product' });
        return;
      }
      
      //Check if any results were returned
      if (results.length === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
  
      // Send the actual product data in the response
      const productData = results;
      res.status(200).json({
        status: 'success',
        message: 'Get product successfully',
        product: productData,
      });

    });
  };

  const updateProductInfo = (req,res) => {

  }

  const removeProduct = (req,res) => {

  }

  const getProductReview = (req, res) => {
    const productId = req.params.id;
  
    const GET_PRODUCT_QUERY = `SELECT p.*, u.username
      FROM product_review p
      JOIN user u ON p.user_id = u.user_id
      WHERE p.product_id = ?;`;
  
    db.query(GET_PRODUCT_QUERY, [productId], (err, results) => {
      if (err) {
        console.error('Error getting product: ' + err);
        res.status(500).json({ error: 'Error getting product' });
        return;
      }
  
    // Check if any results were returned
    if (results.length === 0) {
        res.status(404).send('error: Product not found');
        return;
      }      

    // Format timestamps to "YYYY-MM-DD HH:mm:ss" format
    const reviewData = results.map(review => {
        // Assuming review.review_timestamp is the database timestamp
        const dbTimestamp = new Date(review.review_timestamp);
        const formattedTimestamp = dbTimestamp.toISOString().replace('T', ' ').slice(0, -5);

        // Add the formatted timestamp to the review object
        return { ...review, review_timestamp: formattedTimestamp };
    });

      res.status(200).json({
        status: 'success',
        message: 'Get product successfully',
        review: reviewData,
      });
    });
  };  

module.exports = { addProduct, getOneProduct, updateProductInfo, removeProduct, getProductReview };