const router = require("express").Router();

const { getFirstName, updateUser, queryProducts, deleteProducts } = require("../controllers/shopController");

router.route("/user-info/:userId").get(getFirstName);
router.route("/updateUser/:userId").put(updateUser);
router.route("/products/:userId").get(queryProducts);
router.route("/deleteProducts/:productId").delete(deleteProducts);

module.exports = router;