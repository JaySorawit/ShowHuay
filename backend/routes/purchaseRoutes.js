const router = require("express").Router();
const { purchaseProduct } = require("../controllers/purchaseController");

router.route("/placeOrder/:userId").post(purchaseProduct);

module.exports = router;