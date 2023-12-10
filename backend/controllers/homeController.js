const db = require('../Database/database')

/************************************* Query Products By highest quntity  *******************************/
const queryhighestquntityproduct = (req, res) => {
  const searchKey = req.params.searchKey;
  const selectProductQuery = "SELECT product.*, SUM(purchase_product.quantity) AS total_sales FROM product JOIN purchase_product ON purchase_product.product_id = product.product_id GROUP BY product.product_id ORDER BY total_sales DESC LIMIT 5";
  db.query(selectProductQuery, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Failed to fetch products" });
      return;
    }
    res.json(results);
  });
};

/********************************************************************************************************/
module.exports = { queryhighestquntityproduct};