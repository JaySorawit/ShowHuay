/********************************************************************
 *   cartController.js                                              *
 *                                                                  *
 *   Controller managing routes for user shopping carts,            *
 *   handling operations like adding, removing, and updating        *
 *   items in the cart.                                             *
 *                                                                  *
 ********************************************************************
*/

const db = require("../Database/database");

const addToCart = (req, res) => {
  const user_id = req.body.userId;
  const product_id = req.body.productId;
  const quantity = req.body.quantity;

  try {
    const ADD_TO_CART = `INSERT IGNORE INTO user_shopping_cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
    db.query(ADD_TO_CART, [user_id, product_id, quantity], (err, results) => {
      if (err) {
        console.error("Error adding to cart: " + err);
        res.status(500).json({ error: "Error adding to cart" });
        return;
      } else {
        if (results.affectedRows === 0) {
          // Handle the case where the entry is duplicate
          res.status(200).json({
            status: "success",
            message: "Product is already in the cart",
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "Product added to cart successfully",
            results: results,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getCart = (req, res) => {
  const userId = req.params.userId;
  const GET_CART = `SELECT * FROM user_shopping_cart WHERE user_id = ?;`;

  db.query(GET_CART, [userId], (err, results) => {
    if (err) {
      console.error("Error getting cart: " + err);
      return res.status(500).json({ error: "Error getting cart" });
    }

    const cart = results.map((cart) => ({
      user_id: cart.user_id,
      product_id: cart.product_id,
      quantity: cart.quantity,
    }));

    if (cart.length === 0) {
      return res.status(204).json({
        status: "success",
        message: "Cart is empty",
        cart: [],
      });
    }

    res.status(200).json({
      status: "success",
      message: "Cart found successfully",
      carts: cart,
    });
  });
};

const getCartCount = (req, res) => {
  const userId = req.params.userId;
  const GET_CART_COUNT_QUERY = `SELECT COUNT(*) AS cartCount FROM user_shopping_cart WHERE user_id = ?`;

  db.query(GET_CART_COUNT_QUERY, [userId], (err, results) => {
    if (err) {
      console.error("Error getting cart count: " + err);
      return res.status(500).json({ error: "Error getting cart count" });
    }

    if (results.length > 0) {
      const cartCount = results[0].cartCount;
      return res.status(200).json({ cartCount });
    } else {
      return res.status(200).json({ cartCount: 0 });
    }
  });
};

const removeFromCart = async (req, res) => {
  const { user_id, product_id } = req.body;
  const query = `DELETE FROM user_shopping_cart WHERE user_id = ${user_id} AND product_id = ${product_id}`;
  try {
    const result = await db.query(query);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Deletion successful" });
    } else {
      res
        .status(404)
        .json({ message: "No matching record found for deletion" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const query = `UPDATE cart user_shopping_cart quantity = ${quantity} WHERE user_id = ${user_id} AND product_id = ${product_id}`;
  try {
    const result = await db.query(query);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateQuantityCart = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  const sql = `UPDATE user_shopping_cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;

  db.query(sql, [quantity, userId, productId], (err, result) => {
    if (err) {
      console.error('Error updating quantity:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json({ message: 'Quantity updated successfully' });
  });
};

module.exports = { addToCart, getCart, getCartCount, removeFromCart, updateCart, updateQuantityCart };
