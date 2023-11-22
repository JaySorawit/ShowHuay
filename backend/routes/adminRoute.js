const router = require("express").Router();

const { products } = require("../controllers/adminController");

router.route("/products").get(products);

module.exports = router;