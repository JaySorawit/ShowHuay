const db = require('../Database/database')

const products = (req, res) => {

    const query = 'SELECT * FROM product';

    db.query(query, (err, results) => {
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

module.exports = { products, deleteProducts };