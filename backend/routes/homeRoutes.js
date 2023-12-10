/********************************************************************
 *                                                                  *
 *   homeRoutes.js                                                  *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for home page                          *
 *                                                                  *
 ********************************************************************
 */

 const router = require("express").Router();

 const { queryhighestquntityproduct } = require("../controllers/homeController");
 
 router.route("/").get(queryhighestquntityproduct);
 module.exports = router;