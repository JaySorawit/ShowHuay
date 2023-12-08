const db = require("../Database/database");

const addToCart =  (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  
  try {
    const ADD_TO_CART = `INSERT INTO user_shopping_cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
    db.query(ADD_TO_CART, [user_id, product_id, quantity], (err, results) => {
        if (err) {
            console.error("Error adding to cart: " + err);
            res.status(500).json({ error: "Error adding to cart" });
            return;
        } else {
            res.status(200).json({
                status: "success",
                message: "Product added to cart successfully",
                results: results,
        });
        }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getCart = (req, res) => {
    const user_id = req.body && req.body.user_id;
    const GET_CART = `SELECT * FROM user_shopping_cart WHERE user_id = ?;`;

    db.query(GET_CART, [user_id], (err, results) => {
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
            results: cart,
        });
    });
};


const removeFromCart = async (req, res) => {
    const { user_id, product_id } = req.body;
    const query = `DELETE FROM user_shopping_cart WHERE user_id = ${user_id} AND product_id = ${product_id}`;
    try {
        const result = await db.query(query);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
    }

const updateCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const query = `UPDATE cart user_shopping_cart quantity = ${quantity} WHERE user_id = ${user_id} AND product_id = ${product_id}`;
    try {
        const result = await db.query(query);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
    }

module.exports = { addToCart, getCart, removeFromCart, updateCart };