const db = require("../Database/database");

/******************************************* Get User Address **********************************************/
  const getUserAddress = (req, res) => {
  const userId = req.params.userId;

  const query = `
        SELECT *
        FROM user_shipping_address
        WHERE user_id = ?
        `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error getting user address:", err);
      res.status(500).json({ error: "Failed to get user address" });
      return;
    }
    res.json(results);
  });
};
/***********************************************************************************************************/

/******************************************* Get One User Address ******************************************/
  const getOneUserAddress = (req, res) => {
  const addressId = req.params.addressId;
  
  const query = `
        SELECT *
        FROM user_shipping_address
        WHERE address_id = ?
        `;
  db.query(query, [addressId], (err, results) => {
    if (err) {
      console.error("Error getting user address:", err);
      res.status(500).json({ error: "Failed to get user address" });
      return;
    }
    res.json(results);
  });
};
/***********************************************************************************************************/


/******************************************** Add User Address *********************************************/
  const addUserAddress = (req, res) => {
  const userId = req.params.userId;
  const address = req.body;
  const { fname, lname, telephoneNumber, addressinfo, district, province, zipcode } = address;
  
  const checkAddress = `SELECT COUNT(address_id) AS TotalAddress FROM user_shipping_address WHERE user_id = ?`;
  db.query(checkAddress, [userId], (err, results) => {
      if (err) {
          console.error("Error checking user address:", err);
          res.status(500).json({ error: "Failed to check user address" });
          return;
      }
  
      console.log(results[0].TotalAddress);
  
      let addressDefault;
      if (results[0].TotalAddress !== 0) {
          addressDefault = 0;
      } else {
          addressDefault = 1;
          console.log(addressDefault); 
      }
  
      const addUserAddress = `
          INSERT INTO user_shipping_address 
          (user_id, address_fname, address_lname, address_telephone_number, 
          province, district, zipcode, address_detail, address_default)  
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      db.query(
          addUserAddress,
          [userId, fname, lname, telephoneNumber, province, district, zipcode, addressinfo, addressDefault],
          (err, results) => {
              if (err) {
                  console.error("Error adding user address:", err);
                  res.status(500).json({ error: "Failed to add user address" });
                  return;
              }
              res.json(results);
          }
      );
  });
};
/***********************************************************************************************************/

/************************************** Update User Address ***********************************************/
  const updateUserAddress = (req, res) => {
    const creditCardId = req.params.creditCardId;
    const address = req.body;
    console.log(address);
    const { fname, lname, telephoneNumber, addressinfo, district, province, zipcode } = address;

    const updateAddressQuery = `
    UPDATE user_shipping_address 
    SET 
        address_fname = ?,
        address_lname = ?,
        address_telephone_number = ?,
        province = ?,
        district = ?,
        zipcode = ?,
        address_detail = ?
    WHERE address_id = ?;
    `;

    db.query(updateAddressQuery,[fname,lname,telephoneNumber,province,district,zipcode,addressinfo,creditCardId,],(err, results) => {
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

/***************************************** Delete User Address **********************************************/
  const deleteUserAddress = (req, res) => {
  const addressId = req.params.addressId;
  console.log(addressId);
  const query = `
        DELETE FROM user_shipping_address
        WHERE address_id = ?
      `;
  db.query(query, [addressId], (err, results) => {
    if (err) {
      console.error("Error deleting user address:", err);
      res.status(500).json({ error: "Failed to delete user address" });
      return;
    }
    res.json(results);
  });
};
/***********************************************************************************************************/

/******************************************* Get Districts *************************************************/
const getDistricts = (req, res) => {
    const { province } = req.params;

    const getDistricts = `SELECT DISTINCT district FROM address WHERE province = ? ORDER BY address.district ASC`;

    db.query(getDistricts, [province], (err, results) => {
        if (err) {
            console.error('Error fetching districts:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
};

/***********************************************************************************************************/


/******************************************* Get Provinces *************************************************/
  const getProvinces = (req, res) => {
  const getProvinces = `SELECT DISTINCT province FROM address ORDER BY address.province ASC`;

  db.query(getProvinces, (err, results) => {
    if (err) {
        console.error('Error fetching provinces:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.json(results);
  });
};
/***********************************************************************************************************/

/******************************************* Get Zipcodes *************************************************/
 const getZipcode = (req, res) => {
    const { district, province } = req.params;
    const getZipcode = `SELECT DISTINCT zipcode FROM address WHERE district = ? AND province = ?`;
  
    db.query(getZipcode, [district, province], (err, results) => {
      if (err) {
        console.error('Error fetching zipcode:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
      res.json(results);
    });
  };
/***********************************************************************************************************/

module.exports = {
  getUserAddress,
  getOneUserAddress,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getDistricts,
  getProvinces,
  getZipcode,
};
