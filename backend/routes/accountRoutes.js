const router = require("express").Router();

const { getUserInfo, updateUserInfo, queryUsername, queryPurchases, updateReviewState, AddProductReview } = require("../controllers/accountController");

router.route("/getuser/:userId").get(getUserInfo);
router.route("/updateuser/:userId").post(updateUserInfo);
router.route("/username/:productId").get(queryUsername);
router.route("/purchases/:userId").get(queryPurchases);
router.route("/review/:purchaseId").put(updateReviewState);
router.route("/addReview").post(AddProductReview);

module.exports = router;