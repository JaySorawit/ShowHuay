const router = require("express").Router();

const { getFirstName, updateUser, addProduct, queryProducts, getProduct, updateProduct, deleteProducts } = require("../controllers/shopController");

router.route("/userInfo/:userId").get(getFirstName);
router.route("/updateUser/:userId").put(updateUser);
router.route("/addProduct/:userId").post(addProduct);
router.route("/products/:userId").get(queryProducts);
router.route("/getProduct/:productId").get(getProduct);
router.route("/updateProduct/:productId").put(updateProduct);
router.route("/deleteProducts/:productId").delete(deleteProducts);

module.exports = router;