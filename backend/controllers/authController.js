/********************************************************************
 *   authController.js                                              *
 *                                                                  *
 *   Controller handling routes for user accounts includes          *
 *   middleware for authentication and authorization.               *
 *                                                                  *
 ********************************************************************
*/

const db = require("../Database/database");

/********************************** Register BackEnd ****************************************/

/***** Registration System *****/
const register = (req, res) => {
  const { email, username, password } = req.body;
  const insertUserQuery = `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`;

  db.query(insertUserQuery, [email, username, password], (err, results) => {
    if (err) {
      console.error("Error registering user: " + err);
      res.status(500).json({ error: "Error registering user" });
      return;
    }

    const user = results.insertId;
    res.status(200).json({
      status: "success",
      message: "User registered successfully",
      userId: user.user_id,
      username: user.username,
    });
  });
};
/******************************/

/***** Query Email System *****/
const checkEmail = (req, res) => {
  const { email } = req.query;
  const selectEmailQuery = "SELECT COUNT(*) AS count FROM user WHERE email = ?";

  db.query(selectEmailQuery, [email], (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
};
/******************************/

/***** Query Username System *****/
const checkUsername = (req, res) => {
  const { username } = req.query;
  const selectUserQuery =
    "SELECT COUNT(*) AS count FROM user WHERE username = ?";

  db.query(selectUserQuery, [username], (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
};
/******************************/

/***********************************************************************************************/

/************************************** LogIn BackEnd ******************************************/
const login = (req, res) => {
  const { email, password } = req.body;
  const selectEmailQuery = "SELECT * FROM user WHERE email = ?";

  db.query(selectEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      res.status(500).json({ error: "Error retrieving user" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = results[0];
    if (password !== user.password) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      userId: user.user_id,
      username: user.username,
    });
  });
};

/***********************************************************************************************/

module.exports = { register, checkEmail, checkUsername, login };