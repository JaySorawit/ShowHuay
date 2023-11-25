const router = require("express").Router();

const { orders, users, deleteUsers, addUsers, products, deleteProducts } = require("../controllers/adminController");

router.route("/orders").get(orders);

router.route("/users").get(users);
router.route("/users/:userId").delete(deleteUsers);
router.route("/addusers").post(addUsers);

router.route("/products").get(products);
router.route("/products/:productId").delete(deleteProducts);


module.exports = router;