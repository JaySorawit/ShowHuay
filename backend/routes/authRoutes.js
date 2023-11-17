/********************************************************************
 *
 * auth.js
 *  
 *   This file contains a collection of routers to handle 
 *   requests to the backend for user authentication information
 * 
 ********************************************************************
 */

 const router = require("express").Router();

 const { register, checkEmail, login } = require("../controllers/authController");
 
 router.route("/register").post(register);
 router.route("/check-email").get(checkEmail);
 router.route("/login").post(login);
 
 module.exports = router;