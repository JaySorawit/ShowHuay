const db = require('../Database/database')

const purchaseProduct = (req, res) => {
    const userId = req.params.userId;
    const creditCardId = req.body.creditCardId;
    const productInfo = req.body.productInfo;

    const insertPurchaseQuery = `INSERT INTO purchase (user_id, credit_card_id) VALUES (?, ?)`;

    db.query(insertPurchaseQuery, [userId, creditCardId], (purchaseErr, purchaseResults) => {
        if (purchaseErr) {
            console.error("Error purchasing product:", purchaseErr);
            res.status(500).json({ error: "Failed to purchase product" });
            return;
        }

        const purchaseId = purchaseResults.insertId;
        
        productInfo.forEach((product) => {
            const { productId, quantity } = product;

            const updateStockQuery = `UPDATE product SET stock_remaining = stock_remaining - ? WHERE product_id = ? AND stock_remaining >= ?`;

            db.query(updateStockQuery, [quantity, productId, quantity], (updateErr, updateResults) => {
                if (updateErr) {
                    console.error("Error updating stock:", updateErr);
                    res.status(500).json({ error: "Failed to update stock" });
                    return;
                }

                if (updateResults.affectedRows === 0) {
                    res.status(400).json({ error: "Insufficient stock for the product" });
                    return;
                }

                const insertPurchaseProductQuery = `INSERT INTO purchase_product (purchase_id, product_id, quantity) VALUES (?, ?, ?)`;
                db.query(insertPurchaseProductQuery, [purchaseId, productId, quantity], (productErr) => {
                    if (productErr) {
                        console.error("Error purchasing product:", productErr);
                        res.status(500).json({ error: "Failed to purchase product" });
                        return;
                    }
                });
            });
        });

        res.status(200).json({ message: "Successfully purchased product" });
    });
};



module.exports = { purchaseProduct };