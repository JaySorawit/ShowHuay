const router = require("express").Router();
const { purchaseProduct } = require("../controllers/purchaseController");

router.route("/purchase").post(purchaseProduct);

module.exports = router;