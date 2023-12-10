const db = require('../Database/database')

const purchaseProduct = (req, res) => {
    const { userId, productId } = req.body;
    const insertPurchaseQuery = "INSERT INTO purchase (user_id, product_id) VALUES (?, ?)";
    db.query(insertPurchaseQuery, [userId, productId], (err, results) => {
        if (err) {
        console.error("Error purchasing product:", err);
        res.status(500).json({ error: "Failed to purchase product" });
        return;
        }
        res.json(results);
    });
    };

module.exports = { purchaseProduct };