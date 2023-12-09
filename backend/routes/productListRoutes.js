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

 const { queryProductsCategoryId } = require("../controllers/ProductListController");
 
 router.route("/productlist/:categoryId").get(queryProductsCategoryId);
 router.route("/productlist/keyword/:searchkey").get(queryProductsCategoryId);
 module.exports = router;