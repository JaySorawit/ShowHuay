import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Form, Button } from 'react-bootstrap';
import './css/Coupons.css';

function Coupons() {

    /************************************** Initialize State ***************************************/
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const [newCoupon, setNewCoupon] = useState({
        coupon_code: '',
        discount_amount: '',
        discount_type: '',
        description: '',
        expiration_date: today,
    });
    const [coupons, setCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [showAddCouponModal, setShowAddCouponModal] = useState(false);
    const couponCodeRef = useRef(null);
    const [couponCodeExists, setCouponCodeExists] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    /***********************************************************************************************/

    /************************************* Query Coupons *********************************************/
    useEffect(() => {
        fetch('http://localhost:3000/system/coupons')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCoupons(data);
                setFilteredCoupons(data);
            })
            .catch(error => {
                console.error('Error fetching coupons:', error);
            });
    }, []);
    /*************************************************************************************************/

    /************************************** Search Coupons *********************************************/
    useEffect(() => {
        const results = coupons.filter(coupon =>
            coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCoupons(results);
    }, [searchTerm, coupons]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };
    /****************************************************************************************************/

    /************************************** Delete Coupons *********************************************/
    const handleDelete = couponCode => {
        fetch(`http://localhost:3000/system/coupons/${couponCode}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const updatedConpons = coupons.filter(coupon => coupon.coupon_code !== couponCode);
                setCoupons(updatedConpons);
                setFilteredCoupons(updatedConpons);

                window.alert('Coupon deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting coupon:', error);
            });
    };
    /*************************************************************************************************/

    /****************************************** Toggle System **********************************************/
    const toggleAddCouponModal = () => {
        setShowAddCouponModal(!showAddCouponModal);
    };

    const resetFormFields = () => {
        setNewCoupon({
            coupon_code: '',
            discount_amount: '',
            discount_type: '',
            description: '',
            expiration_date: today,
        });
        setCouponCodeExists(false);
        setFormSubmitted(false);
    };
    /*********************************************************************************************************/

    /********************************************** Query Coupon code *********************************************/
    const handleCouponCodeCheck = async () => {
        try {
            const response = await fetch(`http://localhost:3000/system/check-coupon-code?coupon_code=${newCoupon.coupon_code}`);
            const data = await response.json();
            setCouponCodeExists(data.exists);
        } catch (error) {
            console.error('Error checking coupon code:', error);
        }
    };
    /************************************************************************************************************/

    /********************************************** Handle Change *********************************************/
    const handleCouponCodeChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon({ ...newCoupon, coupon_code: value });

        if (name === 'coupon_code') {
            setCouponCodeExists(false);
        }

    };
    const handleDiscountAmountChange = (e) => {
        const { value } = e.target;
        setNewCoupon({ ...newCoupon, discount_amount: value });
    };
    const handleDiscountTypeChange = (e) => {
        const { value } = e.target;
        setNewCoupon({ ...newCoupon, discount_type: value });
    };
    const handleDescriptionAmountChange = (e) => {
        const { value } = e.target;
        setNewCoupon({ ...newCoupon, description: value });
    };
    const handleDateChange = (date) => {
        setNewCoupon({ ...newCoupon, expiration_date: date });
    };
    /**********************************************************************************************************/

    /************************************************ Add Coupon ***********************************************/
    const handleAddCoupon = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        /******************** Condition to Submit *********************/
        if (couponCodeExists) {
            couponCodeRef.current.focus();
            return;
        }
        /**************************************************************/

        fetch('http://localhost:3000/system/addcoupons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCoupon),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setShowAddCouponModal(false);
                window.alert('Coupon added successfully');
                window.location.reload()
            })
            .catch((error) => {
                console.error('Error adding coupon:', error);
            });
    };
    /**********************************************************************************************************/

    return (
        <div className="wrapper">
            <Header />
            <Sidebar />
            {/* Coupons Content */}
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>Coupons</h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header">
                                    <input
                                        type="text"
                                        placeholder="Search by coupon code..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="search-input"
                                    />
                                    <span className="add-user-icon ms-3" onClick={toggleAddCouponModal}>
                                        <i className="nav-icon fas fa-plus" />
                                    </span>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Coupon code</th>
                                                <th>Discount amount</th>
                                                <th>Discount type</th>
                                                <th>Description</th>
                                                <th>Expiration date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCoupons
                                                .sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date))
                                                .map(coupon => (
                                                    <tr key={coupon.coupon_code}>
                                                        <td className="text-cell">{coupon.coupon_code}</td>
                                                        <td className="text-cell">{coupon.discount_amount}</td>
                                                        <td className="text-cell">{coupon.discount_type}</td>
                                                        <td className="text-cell">{coupon.description}</td>
                                                        <td className="text-cell">{format(new Date(coupon.expiration_date), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                        <td className="text-cell">
                                                            <button onClick={() => handleDelete(coupon.coupon_code)} className="delete-button">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Add User Modal */}
                {showAddCouponModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => {
                                toggleAddCouponModal();
                                resetFormFields();
                            }}>
                                &times;
                            </span>
                            <h5 className='add-user-text'>Add new coupon</h5>
                            <Form onSubmit={handleAddCoupon}>
                                <Form.Group className="form-layout" controlId="coupon-code">
                                    <Form.Control
                                        type="text"
                                        placeholder="Coupon code"
                                        name="coupon-code"
                                        value={newCoupon.coupon_code}
                                        onChange={handleCouponCodeChange}
                                        onBlur={handleCouponCodeCheck}
                                        ref={couponCodeRef}
                                        required
                                    />
                                    {couponCodeExists && (
                                        <div className="mt-2" style={{ color: 'red' }}>
                                            *This coupon code is already in use.
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="discount-amount">
                                    <Form.Control
                                        type="text"
                                        placeholder="Discount amount"
                                        name="discount-amount"
                                        value={newCoupon.discount_amount}
                                        onChange={handleDiscountAmountChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="discount-amount">
                                    <Form.Label>Discount Type</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Fixed Amount"
                                            type="radio"
                                            id="fixed-amount"
                                            name="discount-type"
                                            value="Fixed Amount"
                                            checked={newCoupon.discount_type === 'Fixed Amount'}
                                            onChange={handleDiscountTypeChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="Percentage"
                                            type="radio"
                                            id="percentage"
                                            name="discount-type"
                                            value="Percentage"
                                            checked={newCoupon.discount_type === 'Percentage'}
                                            onChange={handleDiscountTypeChange}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="description">
                                    <Form.Control
                                        type="text"
                                        placeholder="Description"
                                        name="description"
                                        value={newCoupon.description}
                                        onChange={handleDescriptionAmountChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="expiration-date">
                                    <Form.Label>Expiration Date</Form.Label>
                                    <br />
                                    <DatePicker
                                        selected={newCoupon.expiration_date}
                                        onChange={handleDateChange}
                                        dateFormat="dd-MM-yyyy HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={60}
                                    />
                                </Form.Group>

                                <div className="form-layout" style={{ marginBottom: '16px' }}>
                                    <Button
                                        className="btn-submit w-100"
                                        type="submit"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Coupons;