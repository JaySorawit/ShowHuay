/********************************************************************
 *                                                                  *
 *   cartRoutes.js                                                  *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for cart information                   *
 *                                                                  *
 ********************************************************************
 */

const router = require("express").Router();

const { addToCart, getCart, getCartCount, updateCart, removeFromCart, updateQuantityCart } = require("../controllers/cartController");

router.route("/getCart/:userId").get(getCart);
router.route("/getCartCount/:userId").get(getCartCount);
router.route("/addToCart").post(addToCart);
router.route("/updateCart").put(updateCart);
router.route("/removeFromCart").delete(removeFromCart);
router.route("/updateQuantity/:userId/:productId").put(updateQuantityCart);

module.exports = router;