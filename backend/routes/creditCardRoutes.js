/********************************************************************
 *                                                                  *
 *   creditCardRoutes.js                                            *
 *                                                                  *
 *   This file contains a collection of routers to handle           *
 *   requests to the backend for credit cards information           *
 *                                                                  *
 ********************************************************************
 */

const route = require("express").Router();

const { 
    getUserCreditCard,
    getOneUserCreditCard,
    addUserCreditCard,
    updateUserCreditCard,
    deleteUserCreditCard,
    checkCreditCard
 } = require("../controllers/creditCardController");

route.route("/getCreditCard/:userId").get(getUserCreditCard);
route.route("/getOneCreditCard/:creditCardId").get(getOneUserCreditCard);
route.route("/addCreditCard/:userId").post(addUserCreditCard);
route.route("/updatecreditCard/:creditCardId").put(updateUserCreditCard);
route.route("/deletecreditCard/:creditCardId").delete(deleteUserCreditCard);
route.route("/check-creditCard/").get(checkCreditCard);

module.exports = route;