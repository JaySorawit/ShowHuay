/********************************************************************
 *                                                                  *
 *   purchaseRoutes.js                                              *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for purchase information               *
 *                                                                  *
 ********************************************************************
 */

const router = require("express").Router();
const { purchaseProduct } = require("../controllers/purchaseController");

router.route("/placeOrder/:userId").post(purchaseProduct);

module.exports = router;