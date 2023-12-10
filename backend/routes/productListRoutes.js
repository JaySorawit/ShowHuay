/********************************************************************
 *                                                                  *
 *   productListRoutes.js                                           *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for product information                *
 *                                                                  * 
 ********************************************************************
 */

 const router = require("express").Router();

 const { queryProductsCategoryId, queryProductskey } = require("../controllers/productListController");
 
 router.route("/productlist/:categoryId").get(queryProductsCategoryId);
 router.route("/productlist/keyword/:searchKey").get(queryProductskey);
 module.exports = router;