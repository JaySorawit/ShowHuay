const db = require('../Database/database')

/****************************************** Orders Section  *********************************************/
const orders = (req, res) => {

    const query = 'SELECT * FROM purchase';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: 'Failed to fetch orders' });
            return;
        }
        res.json(results);
    });
};
/*******************************************************************************************************/

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

/***************************************** Coupons Section  *********************************************/
const coupons = (req, res) => {

    const query = 'SELECT * FROM coupon';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching coupons:', err);
            res.status(500).json({ error: 'Failed to fetch coupons' });
            return;
        }
        res.json(results);
    });
};

const deleteCoupons = (req, res) => {
    const couponCode = req.params.couponCode;

    const deleteQuery = 'DELETE FROM coupon WHERE coupon_code = ?';

    db.query(deleteQuery, [couponCode], (err, results) => {
        if (err) {
            console.error('Error deleting coupon:', err);
            res.status(500).json({ error: 'Error deleting coupon' });
            return;
        }

        res.status(200).json({ message: 'coupon deleted successfully' });
    });
};

const checkCouponCode = (req, res) => {
    const { coupon_code } = req.query;

    const query = 'SELECT COUNT(*) AS count FROM coupon WHERE coupon_code = ?';

    db.query(query, [coupon_code], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const count = results[0].count;

        if (count > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    });
};

const addCoupons = (req, res) => {
    const { coupon_code, discount_amount, discount_type, description, expiration_date } = req.body;

    const INSERT_COUPON_QUERY = `INSERT INTO coupon (coupon_code, discount_amount, discount_type, description, expiration_date) VALUES (?, ?, ?, ?, ?)`;
    db.query(INSERT_COUPON_QUERY, [coupon_code, discount_amount, discount_type, description, expiration_date], (err, results) => {
        if (err) {
            console.error('Error Adding coupon: ' + err);
            res.status(500).json({ error: 'Error Adding coupon' });
            return;
        }

        const coupon = results.insertId;

        res.status(200).json({
            status: 'success',
            message: 'Coupon added successfully',
            couponCode: coupon.coupon_code,
        });
    });
};
/********************************************************************************************************/

module.exports = { orders, users, deleteUsers, addUsers, products, deleteProducts, coupons, deleteCoupons, checkCouponCode, addCoupons };