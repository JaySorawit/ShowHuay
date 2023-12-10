/********************************************************************
 *   shopController.js                                              *
 *                                                                  *
 *   Controller handling backend routes for managing                *
 *   shopping-related functionalities, including product listings,  *
 *   searching, and user interactions with the online shop.         *
 *                                                                  *
 ********************************************************************
*/

const db = require("../Database/database");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

/***************************************** Query FirstName  *********************************************/
const getFirstName = (req, res) => {
  const userId = req.params.userId;
  const selectFirstNameQuery = "SELECT * FROM user WHERE user_id = ?";

  db.query(selectFirstNameQuery, [userId], (error, rows) => {
    if (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (rows.length > 0) {
      res.json(rows[0].fname);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};
/********************************************************************************************************/

/******************************************** Update User  **********************************************/
const updateUser = (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, phoneNumber } = req.body;
  const updateUserQuery =
    "UPDATE user SET fname = ?, lname = ?, telephone_number = ? WHERE user_id = ?";

  db.query(
    updateUserQuery,
    [firstName, lastName, phoneNumber, userId],
    (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Failed to update user" });
        return;
      }
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
    }
  );
};
/********************************************************************************************************/

/***************************************** Add Product Section  *****************************************/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/product-img/");
  },
  filename: (req, file, cb) => {
    const temporaryFilename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, temporaryFilename);
  },
});

const upload = multer({ storage }).single("imagePath");

const addProduct = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Error uploading file: " + err);
      res.status(500).json({ error: "Error uploading file" });
      return;
    }

    const userId = req.params.userId;
    const {
      categoryId,
      productName,
      productDescription,
      price,
      stockRemaining,
    } = req.body;
    const imagePath = req.file ? `../product-img/${req.file.filename}` : null;
    const insertProductQuery = `INSERT INTO product (user_id, category_id, product_name, product_description, price, stock_remaining, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      insertProductQuery,
      [
        userId,
        categoryId,
        productName,
        productDescription,
        price,
        stockRemaining,
        imagePath,
      ],
      (err, results) => {
        if (err) {
          console.error("Error adding product: " + err);
          res.status(500).json({ error: "Error adding product" });
          return;
        }

        const productId = results.insertId;

        const updatedFilename = `${productId}${path.extname(
          req.file.originalname
        )}`;
        const updatedImagePath = `../product-img/${updatedFilename}`;
        const imagePathToChange = path.join(
          "../frontend/public/product-img/",
          imagePath
        );

        fs.rename(
          imagePathToChange,
          path.join("../frontend/public/product-img/", updatedImagePath),
          (err) => {
            if (err) {
              console.error("Error updating image filename:", err);
            }

            const updateImagePathQuery = `UPDATE product SET image_path = ? WHERE product_id = ?`;
            db.query(
              updateImagePathQuery,
              [updatedImagePath, productId],
              (err) => {
                if (err) {
                  console.error(
                    "Error updating image path in the database:",
                    err
                  );
                }

                res.status(200).json({
                  status: "success",
                  message: "Product added successfully",
                  productId: productId,
                  productName: productName,
                });
              }
            );
          }
        );
      }
    );
  });
};
/********************************************************************************************************/

/******************************************* Query Products  ********************************************/
const queryProducts = (req, res) => {
  const userId = req.params.userId;
  const selectProductQuery = "SELECT * FROM product WHERE user_id = ?";

  db.query(selectProductQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Failed to fetch products" });
      return;
    }
    res.json(results);
  });
};
/********************************************************************************************************/

/******************************************* Get Product ************************************************/
const getProduct = (req, res) => {
  const productId = req.params.productId;
  const selectProductQuery =
    "SELECT product_name, product_description, price, stock_remaining FROM product WHERE product_id = ?";

  db.query(selectProductQuery, [productId], (error, rows) => {
    if (error) {
      console.error("Error fetching product info:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  });
};
/********************************************************************************************************/

/******************************************* Update Product  ********************************************/
const updateProduct = (req, res) => {
  const productId = req.params.productId;
  const { productName, productDescription, price, stockRemaining } = req.body;
  const updateProductQuery =
    "UPDATE product SET product_name = ?, product_description = ?, price = ?, stock_remaining = ? WHERE product_id = ?";

  db.query(
    updateProductQuery,
    [productName, productDescription, price, stockRemaining, productId],
    (err, results) => {
      if (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: "Failed to update product" });
        return;
      }
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
    }
  );
};
/********************************************************************************************************/

/******************************************* Delete Products  *******************************************/
const deleteProducts = (req, res) => {
  const productId = req.params.productId;
  const selectProductImageQuery =
    "SELECT image_path FROM product WHERE product_id = ?";

  db.query(selectProductImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error retrieving product image:", err);
      res.status(500).json({ error: "Error retrieving product image" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const imagePath = results[0].image_path;

    const deleteProductQuery = "DELETE FROM product WHERE product_id = ?";

    db.query(deleteProductQuery, [productId], (err, deleteResult) => {
      if (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: "Error deleting product" });
        return;
      }

      const imagePathToDelete = path.join(
        "../frontend/public/product-img/",
        imagePath
      );

      fs.unlink(imagePathToDelete, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
        res.status(200).json({ message: "Product deleted successfully" });
      });
    });
  });
};
/**********************************************************************************************************/

module.exports = { getFirstName, updateUser, addProduct, queryProducts, getProduct, updateProduct, deleteProducts };
