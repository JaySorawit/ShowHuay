const router = require("express").Router();

const { queryUsername, queryPurchases } = require("../controllers/accountController");

router.route("/username/:productId").get(queryUsername);
router.route("/purchases/:userId").get(queryPurchases);

module.exports = router;