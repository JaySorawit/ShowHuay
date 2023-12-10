/********************************************************************
 *
 * productRoutes.js
 *  
 *   This file contains a collection of routers to handle 
 *   requests to the backend for product information
 * 
 ********************************************************************
 */

 const router = require("express").Router();

 const { addProduct, getOneProduct, getProductWithPurchaseId, getProductReview } = require("../controllers/productController")
 
 router.route("/addProduct").post(addProduct); 
 router.route("/:id").get(getOneProduct);
 router.route("/purchases/:id").get(getProductWithPurchaseId);
 router.route("/getProductReview/:id").get(getProductReview);
 
 module.exports = router;