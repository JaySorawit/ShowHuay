const router = require("express").Router();

const { getCoupon } = require("../controllers/couponController");

router.route("/:couponId").get(getCoupon);

module.exports = router;