import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./css/Products.css";

function Products() {
  /************************************** Initialize State ***************************************/
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  /***********************************************************************************************/

  /************************************* Query Products ******************************************/
  useEffect(() => {
    fetch("http://localhost:3000/system/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  /*************************************************************************************************/

  /************************************** Search Products ******************************************/
  useEffect(() => {
    const results = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  /*************************************************************************************************/

  /************************************* Delete Products *******************************************/
  const handleDelete = (productId) => {
    fetch(`http://localhost:3000/system/products/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const updatedProducts = products.filter(
          (product) => product.product_id !== productId
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);

        window.alert("Product deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };
  /*************************************************************************************************/

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />
      {/* Products Content */}
      <div className="content-wrapper">
        <section className="content-header">
          <h1>Products</h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="box">
                <div className="box-header">
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
                <div className="box-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Product ID</th>
                        <th>User</th>
                        <th>Name</th>
                        <th>Action</th>
                        {/* Add more table headers as needed */}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.product_id}>
                          <td className="image-cell">
                            {product.image_path && (
                              <img
                                src={`${product.image_path}`}
                                alt={`Image of ${product.product_name}`}
                                style={{
                                  maxWidth: "150px",
                                  maxHeight: "150px",
                                }}
                              />
                            )}
                          </td>
                          <td className="text-cell">{product.product_id}</td>
                          <td className="text-cell">{product.user_id}</td>
                          <td className="text-cell">{product.product_name}</td>
                          <td className="text-cell">
                            <button
                              onClick={() => handleDelete(product.product_id)}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </td>
                          {/* Display other product information */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Products;
