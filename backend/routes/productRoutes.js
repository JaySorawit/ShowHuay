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

 const { addProduct, getOneProduct, updateProductInfo, removeProduct, getProductReview } = require("../controllers/productController")
 
 router.route("/addProduct").post(addProduct); 
 router.route("/:id").get(getOneProduct).patch(updateProductInfo).delete(removeProduct);
 router.route("/getProductReview/:id").get(getProductReview);
 
 module.exports = router;