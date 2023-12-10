/********************************************************************
 *                                                                  *
 *   adminRoutes.js                                                 *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for admin information                  *
 *                                                                  *
 ********************************************************************
 */

const router = require("express").Router();

const {
  orders,
  users,
  deleteUsers,
  addUsers,
  products,
  deleteProducts,
  coupons,
  deleteCoupons,
  checkCouponCode,
  addCoupons,
} = require("../controllers/adminController");

router.route("/orders").get(orders);

router.route("/users").get(users);
router.route("/users/:userId").delete(deleteUsers);
router.route("/addusers").post(addUsers);

router.route("/products").get(products);
router.route("/products/:productId").delete(deleteProducts);

router.route("/coupons").get(coupons);
router.route("/coupons/:couponCode").delete(deleteCoupons);
router.route("/check-coupon-code").get(checkCouponCode);
router.route("/addcoupons").post(addCoupons);

module.exports = router;
