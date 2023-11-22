const router = require("express").Router();

const { products, deleteProducts } = require("../controllers/AdminController");

router.route("/products").get(products);
router.route("/products/:productId").delete(deleteProducts);

module.exports = router;