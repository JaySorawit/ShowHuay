// const db = require('../Database/database')

// const addProduct = (req,res) => {
//     const { productId, userId, categoryId, productName, productDesciption, price, stockRemaining } = req.body;

//     const INSERT_PRODUCT_QUERY = `INSERT INTO product (product_id, user_id, category_id, product_name, product_desciption, price, stock_Remaining) VALUES (?, ?, ?, ?, ?, ?, ?)`;

//     db.query(INSERT_PRODUCT_QUERY, [productId, userId, categoryId, productName, productDesciption, price, stockRemaining], (err, results) => {
//         if (err) {
//             console.error('Error registering user: ' + err);
//             res.status(500).json({ error: 'Error Add Product' });
//             return;
//         }

//         const userId = results.insertId;

//         res.status(200).json({
//             status: 'success',
//             message: 'User registered successfully',
//             userId: userId,
//         });
//     });
// }