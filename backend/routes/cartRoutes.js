const router = require("express").Router();

const { addToCart, getCart, getCartCount, updateCart, removeFromCart  } = require("../controllers/cartController");

router.route("/getCart/:userId").get(getCart);
router.route("/getCartCount/:userId").get(getCartCount);
router.route("/addToCart").post(addToCart);
router.route("/updateCart").put(updateCart);
router.route("/removeFromCart").delete(removeFromCart);

module.exports = router;