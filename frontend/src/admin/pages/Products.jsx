import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the backend
        fetch('http://localhost:3000/system/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

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
                                <div className="box-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                {/* Add more table headers as needed */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product.product_id}>
                                                    <td>{product.product_id}</td>
                                                    <td>{product.product_name}</td>
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
