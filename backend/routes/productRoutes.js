/********************************************************************
 *                                                                  *
 *   productRoutes.js                                               *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for product information                *
 *                                                                  *
 ********************************************************************
 */

const router = require("express").Router();

const {
  addProduct,
  getOneProduct,
  getProductWithPurchaseId,
  getProductReview,
  queryHighestQuntityProduct,
  queryProductsCategoryId, 
  queryProductskey
} = require("../controllers/productController");

router.route("/").get(queryHighestQuntityProduct);
router.route("/addProduct").post(addProduct);
router.route("/:id").get(getOneProduct);
router.route("/purchases/:id").get(getProductWithPurchaseId);
router.route("/getProductReview/:id").get(getProductReview);
router.route("/productlist/:categoryId").get(queryProductsCategoryId);
router.route("/productlist/keyword/:searchKey").get(queryProductskey);

module.exports = router;
