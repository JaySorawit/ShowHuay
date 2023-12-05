const db = require("../Database/database");

/****************************************** Get User Credit Cards *******************************************/
  const getUserCreditCard = (req, res) => {
  const userId = req.params.userId;

  const query = `
        SELECT *
        FROM user_credit_card
        WHERE user_id = ?
        `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error getting user Credit Cards:", err);
      res.status(500).json({ error: "Failed to get user Credit Cards" });
      return;
    }
    res.json(results);
  });
};
/***********************************************************************************************************/


/******************************************* Get One User Credit Cards *************************************/
const getOneUserCreditCard = (req, res) => {
    const creditCardId = req.params.creditCardId;
    
    const query = `
          SELECT *
          FROM user_credit_card
          WHERE credit_card_id = ?
          `;
    db.query(query, [creditCardId], (err, results) => {
      if (err) {
        console.error("Error getting user Credit Cards:", err);
        res.status(500).json({ error: "Failed to get user Credit Cards" });
        return;
      }
      res.json(results);
    });
  };
  /***********************************************************************************************************/
  
  
  /******************************************** Add User Credit Cards ****************************************/
    const addUserCreditCard = (req, res) => {
    const userId = req.params.userId;
    const creditCard = req.body;
    const { creditCardNumber, cardType, expiryDate, cvv } = creditCard;
    
    const checkcreditCard = `SELECT COUNT(credit_card_id) AS TotalcreditCard FROM user_credit_card WHERE user_id = ?`;
    db.query(checkcreditCard, [userId], (err, results) => {
        if (err) {
            console.error("Error checking user creditCard:", err);
            res.status(500).json({ error: "Failed to check user creditCard" });
            return;
        }
    
        console.log(results[0].TotalcreditCard);
    
        let creditCardDefault;
        if (results[0].TotalcreditCard !== 0) {
            creditCardDefault = 0;
        } else {
            creditCardDefault = 1;
            console.log(creditCardDefault); 
        }
    
        const addUsercreditCard = `
            INSERT INTO user_credit_card 
            (user_id, credit_card_number, card_type, expiry_date, cvv, card_default)  
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    
        db.query(
            addUsercreditCard,
            [userId, creditCardNumber, cardType, expiryDate, cvv, creditCardDefault],
            (err, results) => {
                if (err) {
                    console.error("Error adding user creditCard:", err);
                    res.status(500).json({ error: "Failed to add user creditCard" });
                    return;
                }
                res.json(results);
            }
        );
    });
  };
  /***********************************************************************************************************/
  
  /************************************** Update User Credit Cards *******************************************/
    const updateUserCreditCard = (req, res) => {
      // const creditCardId = req.params.creditCardId;
      const creditCard = req.body;
      const { creditCardId, creditCardNumber, cardType, expiryDate, cvv } = creditCard;
      console.log(creditCard);
      console.log(creditCardId);
      const updateAddressQuery = `UPDATE user_credit_card 
      SET 
        credit_card_number = ?,
        card_type = ?,
        expiry_date = ?,
        cvv = ?
        WHERE credit_card_id = ?;
      `;
  
      db.query(updateAddressQuery,[creditCardNumber,cardType,expiryDate,cvv,creditCardId],(err, results) => {
              if (err) {
                  console.error("Error updating user address:", err);
                  res.status(500).json({ error: "Failed to update user address" });
                  return;
              }
              res.json(results);
          }
      );
  
  };
  /***********************************************************************************************************/
  
  /***************************************** Delete User Credit Cards ****************************************/
    const deleteUserCreditCard = (req, res) => {
    const creditCardId = req.params.creditCardId;
    const query = `
          DELETE FROM user_credit_card
          WHERE credit_card_id  = ?
        `;
    db.query(query, [creditCardId], (err, results) => {
      if (err) {
        console.error("Error deleting user address:", err);
        res.status(500).json({ error: "Failed to delete user address" });
        return;
      }
      res.json(results);
    });
  };
  /***********************************************************************************************************/


  /***** Check Credit cards *****/
  const checkCreditCard = (req, res) => {
    const { creditCardNumber } = req.query;

    const query = 'SELECT COUNT(*) AS count FROM user_credit_card WHERE credit_card_number = ?';

    db.query(query, [creditCardNumber], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const count = results[0].count;

        if (count > 0) {
            res.json({ exists: true});
        } else {
            res.json({ exists: false});
        }
    });
  };
  /******************************/

module.exports = {
    getUserCreditCard,
    getOneUserCreditCard,
    addUserCreditCard,
    updateUserCreditCard,
    deleteUserCreditCard,
    checkCreditCard,
  };