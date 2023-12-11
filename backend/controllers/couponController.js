/********************************************************************
 *   couponController.js                                            *
 *                                                                  *
 *   Controller managing routes for coupon operations,              *
 *   including handling coupon functionalities.                     *
 *                                                                  *
 ********************************************************************
*/

const db = require("../Database/database");

/***************************** Get coupon  ***********************************/
const getCoupon = (req, res) => {
    const couponId = req.params.couponId;
    
    const query = `
            SELECT *
            FROM coupon
            WHERE coupon_code = ?
            `;
    db.query(query, [couponId], (err, results) => {
        if (err) {
        console.error("Error getting coupon:", err);
        res.status(500).json({ error: "Failed to get coupon" });
        return;
        }
        res.json(results);
    });
    };
/***************************************************************************/

module.exports = { getCoupon };