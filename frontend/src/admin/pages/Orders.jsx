import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './css/Orders.css'; // Rename the CSS file if necessary

function Orders() {

    /************************************** Initialize State ***************************************/
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    /***********************************************************************************************/

    /************************************** Query Orders *******************************************/
    useEffect(() => {
        fetch('http://localhost:3000/system/orders')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data);
                setFilteredOrders(data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, []);
    /*************************************************************************************************/

    /**************************************** Search Orders ******************************************/
    useEffect(() => {
        const results = orders.filter(order =>
            order.purchase_id && String(order.purchase_id).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(results);
    }, [searchTerm, orders]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };
    /*************************************************************************************************/

    return (
        <div className="wrapper">
            <Header />
            <Sidebar />
            {/* Orders Content */}
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>Orders</h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header">
                                    <input
                                        type="text"
                                        placeholder="Search by order ID..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="search-input"
                                    />
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Purchase ID</th>
                                                <th>Order time</th>
                                                <th>Payment time</th>
                                                <th>Buyer ID</th>
                                                <th>Product ID</th>
                                                <th>Quantity</th>
                                                <th>Credit card ID</th>
                                                <th>Cancel</th>
                                                {/* Add more table headers as needed */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders
                                                .sort((a, b) => b.purchase_id - a.purchase_id)
                                                .map(order => (
                                                    <tr key={order.purchase_id}>
                                                        <td className="text-cell">{order.purchase_id}</td>
                                                        <td className="text-cell">{format(new Date(order.purchase_timestamp), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                        <td className="text-cell">{format(new Date(order.payment_timestamp), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                        <td className="text-cell">{order.user_id}</td>
                                                        <td className="text-cell">{order.product_id}</td>
                                                        <td className="text-cell">{order.quantity}</td>
                                                        <td className="text-cell">{order.credit_card_id}</td>
                                                        <td className="text-cell">{order.cancel}</td>
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

export default Orders;
