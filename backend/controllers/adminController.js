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

module.exports = { products };