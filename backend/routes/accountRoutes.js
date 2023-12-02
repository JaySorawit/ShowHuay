const router = require("express").Router();

const { getUserInfo, updateUserInfo, queryUsername, queryPurchases } = require("../controllers/accountController");

router.route("/getuser/:userId").get(getUserInfo);
router.route("/updateuser/:userId").get(updateUserInfo);
router.route("/username/:productId").get(queryUsername);
router.route("/purchases/:userId").get(queryPurchases);

module.exports = router;