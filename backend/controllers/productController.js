const db = require("../Database/database");

/***************************************** Add product  *********************************************/
const addProduct = (req, res) => {
  const {
    productId,
    userId,
    categoryId,
    productName,
    productDesciption,
    price,
    stockRemaining,
  } = req.body;

  const INSERT_PRODUCT_QUERY = `INSERT INTO product (
        product_id, 
        user_id, 
        category_id, 
        product_name, 
        product_desciption, 
        price, stock_remaining) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    INSERT_PRODUCT_QUERY,
    [
      productId,
      userId,
      categoryId,
      productName,
      productDesciption,
      price,
      stockRemaining,
    ],
    (err, results) => {
      if (err) {
        console.error("Error registering user: " + err);
        res.status(500).json({ error: "Error Add Product" });
        return;
      }

      const userId = results.insertId;
      res.status(200).json({
        status: "success",
        message: "User registered successfully",
        userId: userId,
      });
    }
  );
};
/* ****************************************************************************************************** */

/* **************************************** Get One Product  ******************************************** */
const getOneProduct = (req, res) => {
  const productId = req.params.id;

  const GET_PRODUCT_QUERY = `SELECT COALESCE(SUM(pur.quantity), 0) AS total_sold, u.username, u.telephone_number, p.*
    FROM product p
    JOIN user u ON p.user_id = u.user_id
    LEFT JOIN purchase_product pur ON p.product_id = pur.product_id
    WHERE p.product_id = ?
    GROUP BY u.username, p.product_id
    HAVING p.product_id IS NOT NULL;
    `;

  db.query(GET_PRODUCT_QUERY, [productId], (err, results) => {
    if (err) {
      console.error("Error getting product: " + err);
      res.status(500).json({ error: "Error getting product" });
      return;
    }

    //Check if any results were returned
    if (results.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Send the actual product data in the response
    const productData = results;
    res.status(200).json({
      status: "success",
      message: "Get product successfully",
      product: productData,
    });
  });
};
/* ****************************************************************************************************** */

/************************************ Get Product with Purchase Id ***********************************/
const getProductWithPurchaseId = (req, res) => {
  const purchaseId = req.params.id;

  const GET_PRODUCT_QUERY = `
    SELECT pp.quantity, pp.is_review, p.*, u.username
    FROM purchase_product pp
    JOIN product p ON pp.product_id = p.product_id
    JOIN user u ON p.user_id = u.user_id
    WHERE pp.purchase_id = ?;
  `;

  db.query(GET_PRODUCT_QUERY, [purchaseId], (err, results) => {
    if (err) {
      console.error("Error getting purchase details: " + err);
      res.status(500).json({ error: "Error getting purchase details" });
      return;
    }

    if (results.length === 0) {
      res
        .status(404)
        .json({ error: "Purchase details not found for this purchase" });
      return;
    }

    const purchaseDetails = results;
    res.status(200).json({
      status: "success",
      message: "Get purchase details successfully",
      purchaseDetails: purchaseDetails,
    });
  });
};
/***************************************************************************************************/

/* **************************************** Get Product Review  ******************************************** */
const getProductReview = (req, res) => {
  const productId = req.params.id;

  const GET_PRODUCT_QUERY = `SELECT p.*, u.username
      FROM product_review p
      JOIN user u ON p.user_id = u.user_id
      WHERE p.product_id = ?;`;

  db.query(GET_PRODUCT_QUERY, [productId], (err, results) => {
    if (err) {
      console.error("Error getting product: " + err);
      res.status(500).json({ error: "Error getting product" });
      return;
    }

    // Check if any results were returned
    // if (results.length === 0) {
    //     res.status(404).json({error: 'Product not found'});
    //     return;
    //   }

    // Format timestamps to "YYYY-MM-DD HH:mm:ss" format
    const reviewData = results.map((review) => {
      const dbTimestamp = new Date(review.review_timestamp);
      const formattedTimestamp = dbTimestamp
        .toISOString()
        .replace("T", " ")
        .slice(0, -5);
      return { ...review, review_timestamp: formattedTimestamp };
    });

    res.status(200).json({
      status: "success",
      message: "Get product successfully",
      review: reviewData,
    });
  });
};
/* ****************************************************************************************************** */

module.exports = {
  addProduct,
  getOneProduct,
  getProductWithPurchaseId,
  getProductReview,
};
