const db = require('../Database/database')

/******************************************* Query Products By Category  ********************************/
const queryProductsCategoryId = (req, res) => {
    const categoryId = req.params.categoryId;
    const selectProductQuery = "SELECT * FROM product WHERE category_id = ?";
  
    db.query(selectProductQuery, [categoryId], (err, results) => {
      if (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
        return;
      }
      res.json(results);
    });
  };

/********************************************************************************************************/
module.exports = { queryProductsCategoryId };