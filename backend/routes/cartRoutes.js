const router = require("express").Router();

const { addToCart, getCart, updateCart, removeFromCart  } = require("../controllers/cartController");

router.route("/getCart/").get(getCart);
router.route("/addToCart").post(addToCart);
router.route("/updateCart").put(updateCart);
router.route("/removeFromCart").delete(removeFromCart);

module.exports = router;