const db = require("../Database/database");

/****************************************** Orders Section  ********************************************/
const orders = (req, res) => {
  const selectOrderQuery = "SELECT * FROM purchase";

  db.query(selectOrderQuery, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
      return;
    }
    res.json(results);
  });
};
/*******************************************************************************************************/

/****************************************** Users Section  *********************************************/
const users = (req, res) => {
  const selectUserQuery = "SELECT * FROM user";

  db.query(selectUserQuery, (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Failed to fetch user" });
      return;
    }
    res.json(results);
  });
};

const deleteUsers = (req, res) => {
  const userId = req.params.userId;
  const deleteUserQuery = "DELETE FROM user WHERE user_id = ?";

  db.query(deleteUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Error deleting user" });
      return;
    }
    res.status(200).json({ message: "user deleted successfully" });
  });
};

const addUsers = (req, res) => {
  const { email, username, password, firstName, lastName, phoneNumber } = req.body;
  const insertUserQuery = `INSERT INTO user (email, username, password, fname, lname, telephone_number) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    insertUserQuery,
    [email, username, password, firstName, lastName, phoneNumber],
    (err, results) => {
      if (err) {
        console.error("Error Adding user: " + err);
        res.status(500).json({ error: "Error Adding user" });
        return;
      }

      const user = results.insertId;
      res.status(200).json({
        status: "success",
        message: "User added successfully",
        userId: user.user_id,
        username: user.username,
      });
    }
  );
};
/********************************************************************************************************/

/***************************************** Products Section  ********************************************/
const products = (req, res) => {
  const selectProductQuery = "SELECT * FROM product";

  db.query(selectProductQuery, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Failed to fetch products" });
      return;
    }
    res.json(results);
  });
};

const deleteProducts = (req, res) => {
  const productId = req.params.productId;
  const deleteProductQuery = "DELETE FROM product WHERE product_id = ?";

  db.query(deleteProductQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Error deleting product" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
};
/********************************************************************************************************/

/***************************************** Coupons Section  *********************************************/
const coupons = (req, res) => {
  const selectCouponQuery = "SELECT * FROM coupon";

  db.query(selectCouponQuery, (err, results) => {
    if (err) {
      console.error("Error fetching coupons:", err);
      res.status(500).json({ error: "Failed to fetch coupons" });
      return;
    }
    res.json(results);
  });
};

const deleteCoupons = (req, res) => {
  const couponCode = req.params.couponCode;
  const deleteCouponQuery = "DELETE FROM coupon WHERE coupon_code = ?";

  db.query(deleteCouponQuery, [couponCode], (err, results) => {
    if (err) {
      console.error("Error deleting coupon:", err);
      res.status(500).json({ error: "Error deleting coupon" });
      return;
    }
    res.status(200).json({ message: "coupon deleted successfully" });
  });
};

const checkCouponCode = (req, res) => {
  const { couponCode } = req.query;
  const selectCouponQuery =
    "SELECT COUNT(*) AS count FROM coupon WHERE coupon_code = ?";

  db.query(selectCouponQuery, [couponCode], (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
  const { couponCode, discountAmount, discountType, description, expirationDate } =
    req.body;
  const insertCouponQuery = `INSERT INTO coupon (coupon_code, discount_amount, discount_type, description, expiration_date) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    insertCouponQuery,
    [couponCode, discountAmount, discountType, description, expirationDate],
    (err, results) => {
      if (err) {
        console.error("Error Adding coupon: " + err);
        res.status(500).json({ error: "Error Adding coupon" });
        return;
      }

      const coupon = results.insertId;
      res.status(200).json({
        status: "success",
        message: "Coupon added successfully",
        couponCode: coupon.coupon_code,
      });
    }
  );
};
/********************************************************************************************************/

module.exports = { orders, users, deleteUsers, addUsers, products, deleteProducts, coupons, deleteCoupons, checkCouponCode, addCoupons };
