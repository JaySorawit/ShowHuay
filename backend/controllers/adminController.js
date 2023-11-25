const db = require('../Database/database')

/****************************************** Users Section  *********************************************/
const users = (req, res) => {

    const query = 'SELECT * FROM user';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Failed to fetch user' });
            return;
        }
        res.json(results);
    });
};

const deleteUsers = (req, res) => {
    const userId = req.params.userId;

    const deleteQuery = 'DELETE FROM user WHERE user_id = ?';

    db.query(deleteQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Error deleting user' });
            return;
        }

        res.status(200).json({ message: 'user deleted successfully' });
    });
};

const addUsers = (req, res) => {
    const { email, username, password, fname, lname } = req.body;

    const INSERT_USER_QUERY = `INSERT INTO user (email, username, password, fname, lname) VALUES (?, ?, ?, ?, ?)`;
    db.query(INSERT_USER_QUERY, [email, username, password, fname, lname], (err, results) => {
        if (err) {
            console.error('Error Adding user: ' + err);
            res.status(500).json({ error: 'Error Adding user' });
            return;
        }

        const user = results.insertId;

        res.status(200).json({
            status: 'success',
            message: 'User added successfully',
            userId: user.user_id,
            username: user.username,
        });
    });
};
/********************************************************************************************************/


/***************************************** Products Section  *********************************************/
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
/********************************************************************************************************/

module.exports = { users, deleteUsers, addUsers, products, deleteProducts };