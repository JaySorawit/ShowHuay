import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import AccountNav from './AccountNav';

function MyCreditCard() {

    /***************************************** Initialize State ***********************************************/
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const [creditCards, setCreditCards] = useState([]);
    const [selectedcreditCard, setSelectedcreditCard] = useState('');
    const [ModalOpen, setModalOpen] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [creditCardExists, setcreditCardExists] = useState(false);
    const creditCardRef = useRef(null);
    const [formData, setFormData] = useState({
        creditCardId: '',
        userId: userId,
        creditCardNumber: '',
        cardType: '',
        expiryDate: '',
        cvv: '',
    });
    const [creditCard, setcreditCard] = useState({
        creditCardId: '',
        userId: '',
        creditCardNumber: '',
        cardType: '',
        expiryDate: '',
        cvv: '',
    });
    /**********************************************************************************************************/


    /******************************************* Toggle Modal ************************************************/
    const toggleAddcreditCardModal = () => {
        setModalOpen(!ModalOpen);
    };
    const toggleEditcreditCardModal = () => {
        setModalEdit(!modalEdit);
    };
    /**********************************************************************************************************/


    /******************** Condition to Submit *********************/
    if (creditCardExists && creditCardRef.current) {
        creditCardRef.current.focus();
        return;
    }
    
    
    /*************************************************************/


    /******************************************* Handle Submit ************************************************/
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        if (creditCardExists) {
            return
        }
    
        try {
            const creditCardResponse = await fetch(`http://localhost:3000/creditCard/addCreditCard/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (creditCardResponse.ok) {
                const data = await creditCardResponse.json();
                console.log(data); // Log the response data
                window.location.href = '/mycreditCard';
            } else {
                console.error('Error adding creditCard:', creditCardResponse.status);
            }
        } catch (error) {
            console.error('Error adding creditCard:', error);
        }
    };
    
    /**********************************************************************************************************/

    /****************************************** Get creditCard User **********************************************/
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/creditCard/getCreditCard/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setCreditCards(data);
            } catch (error) {
                console.error('Error fetching creditCard:', error.message);
            }
        };

        fetchData();
    }, [userId]);
    /**********************************************************************************************************/


    /******************************************* Handle Edit **************************************************/
    const handleEdit = async (creditCardId) => {
        try {
            console.log('creditCardId:', creditCardId);
            const response = await fetch(`http://localhost:3000/creditCard/getOneCreditCard/${creditCardId}`);
            if (response.ok) {
                const creditCardData = await response.json();
                console.log('creditcard data:', creditCardData);
                setcreditCard({
                    creditCardId: creditCardData[0].credit_card_id,
                    user_id: creditCardData[0].user_id,
                    creditCardNumber: creditCardData[0].credit_card_number,
                    cardType: creditCardData[0].card_type,
                    expiryDate: creditCardData[0].expiry_date,
                    cvv: creditCardData[0].cvv,
                    CardDefault: creditCardData[0].creditCard_default,
                });
                console.log('creditCard:', creditCard); 
                setModalEdit(true);
                setSelectedcreditCard(creditCardId);

            } else {
                console.error('Failed to fetch creditCard data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching creditCard data:', error);
        }
    };

    /**********************************************************************************************************/


    /********************************* Check credit card number  *********************************************/
    const handlecreditCardCheck = async () => {
        try {
        const response = await fetch(`http://localhost:3000/creditCard/check-creditCard?creditCardNumber=${formData.creditCardNumber}`);
        const data = await response.json();
        console.log('creditCard check response:', data);
        console.log('creditCard check response:', data.exists);
        
        if (data.exists === true) {
            setcreditCardExists(true);
        } else if (data.exists === false) {
            setcreditCardExists(false);
        }
        
        setcreditCardExists(data.exists && formData.creditCardNumber !== creditCard.creditCardNumber);
        } catch (error) {
        console.error('Error checking creditCard:', error);
        }
    };

    const handlecreditCardEditCheck = async () => {
        try {
        const response = await fetch(`http://localhost:3000/creditCard/check-creditCard?creditCardNumber=${creditCard.creditCardNumber}`);
        const data = await response.json();
        console.log('creditCard check response:', data);
        console.log('creditCard check response:', data.exists);
        
        if (data.exists === true && creditCard.creditCardNumber !== formData.creditCardNumber) {
            setcreditCardExists(true);
        } else if (data.exists === false && creditCard.creditCardNumber !== formData.creditCardNumber) {
            setcreditCardExists(false);
        }
        
        } catch (error) {
        console.error('Error checking creditCard:', error);
        }
    };
    /***********************************************************************************************/
    
    
    /*************************************** Update creditCard **************************************************/
    const handleUpdatecreditCard = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/creditCard/updatecreditCard/${formData.creditCardId}"`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creditCard)
            });

            if (response.ok) {
                console.log('Product updated successfully');
                window.location.reload();
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
    /*************************************************************************************************/


    /******************************************* Handle Delete ************************************************/
    const handleDelete = creditCardId => {
        console.log('Delete creditCard with id:', creditCardId);
        fetch(`http://localhost:3000/creditCard/deletecreditCard/${creditCardId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.alert('Product deleted successfully');
                window.location.reload(false);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    };
    /**********************************************************************************************************/
    

    /******************************************* Handle Change ************************************************/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setcreditCard({ ...creditCard, [name]: value });
    };
    /**********************************************************************************************************/

    /* ************************************ Display creadit card property *********************************** */
    const today = new Date();
    const minDate = today.toISOString().slice(0, 7);
    const maskedCreditCardNumber = (creditCardNumber) => {
        if (creditCardNumber) {
            const strippedNumber = creditCardNumber.replace(/\s/g, ''); // Remove existing spaces
            const last4Digits = strippedNumber.slice(-4);
            const maskedPart = 'X'.repeat(strippedNumber.length - 4);
            const formattedNumber = maskedPart.replace(/(.{4})/g, '$1 ').trim();
            return formattedNumber + ' ' + last4Digits;
        } else {
            return 'N/A';
        }
    };
    /**********************************************************************************************************/
    
    
    return (
        <div>
            <Navbar />
            <div className="purchases-container" style={{ paddingTop: '35px', paddingBottom: '35px', backgroundColor: '#F1F0F0', minHeight: '640px' }}>
                <Container style={{ maxWidth: '1080px' }}>
                    <div className="heading">
                        <h4 style={{ fontSize: '20px' }}>{username}'s Account</h4>
                    </div>

                    <Row>
                        <AccountNav />
                        <Col md={10}>
                            <div className="infoBox" style={{ gap: '5px', minHeight: '450px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h5>My Credit Card</h5>
                                    <button
                                        className="btn btn-primary"
                                        style={{ float: 'right', backgroundColor: '#F44C0C', border: 'none' }}
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Add new credit card
                                    </button>
                                </div>
                                <hr style={{ opacity: '100%' }} />
                                {creditCards.length === 0 ? (
                                    <p>You don't have any credit card in the system.</p>
                                ) : (
                                    creditCards.map((creditCard) => (
                                        <div key={creditCard.credit_card_id}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    margin: '0 30px',
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: '500px' }}>
                                                    <p>{`Credit card number : ${maskedCreditCardNumber(creditCard.credit_card_number)}`}</p>
                                                    <p>{`Type : ${creditCard.card_type}`}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', minWidth: '105px' }}>
                                                    {creditCard.card_default === 0 && (
                                                        <React.Fragment>
                                                            <p onClick={() => handleEdit(creditCard.credit_card_id)} style={{ color: '#F44C0C', cursor: 'pointer', marginRight: '10px' }}>
                                                                Edit
                                                            </p>
                                                            <p style={{ color: '#F44C0C' }}>/</p>
                                                            <p onClick={() => handleDelete(creditCard.credit_card_id)} style={{ color: '#F44C0C', cursor: 'pointer' }}>
                                                                Delete
                                                            </p>
                                                        </React.Fragment>
                                                    )}
                                                    {creditCard.card_default === 1 && (
                                                        <p onClick={() => handleEdit(creditCard.credit_card_id)} style={{ color: '#F44C0C', cursor: 'pointer', marginRight: '10px' }}>
                                                            Edit
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <hr style={{ opacity: '100%', margin: '20px' }} />
                                        </div>
                                    ))
                                )}
                            </div>
                            {ModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                <span className="close" onClick={() => toggleAddcreditCardModal()}>&times;</span>
                                    <h5 className='add-user-text' style={{color:'#F44C0C', fontWeight:'700'}}>Add New creditCard</h5>
                                    <Form onSubmit={handleSubmit} style={{maxHeight:'550px',overflow:'auto'}}>
                                        <Form.Group className="form-layout">
                                        <Form.Label>Credit Card Number :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="creditCardNumber"
                                            value={formData.creditCardNumber}
                                            onChange={handleChange}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            maxLength={16}
                                            onBlur={handlecreditCardCheck}
                                            required
                                        />
                                        {creditCardExists && (
                                            <div className="mt-2" style={{ color: 'red' }}>
                                            *This credit card is already in use.
                                            </div>
                                        )
                                        }
                                        </Form.Group>

                                        <Form.Group className="form-layout">
                                        <Form.Label>Card Type :</Form.Label>
                                        <Form.Control
                                            as="select"
                                            placeholder="Select card type"
                                            name="cardType"
                                            value={formData.cardType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled hidden>Select card type</option>
                                            <option value="Visa">Visa</option>
                                            <option value="Mastercard">Mastercard</option>
                                            <option value="AmericanExpress">American Express</option>
                                            <option value="UnionPay">UnionPay</option>
                                            <option value="JCB">JCB</option>
                                        </Form.Control>
                                        </Form.Group>

                                        <Form.Group className="form-layout">
                                            <Form.Label>Expiry date :</Form.Label>
                                            <Form.Control
                                                type="month"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                placeholder="MM/YY"
                                                required
                                                min={minDate}
                                            />
                                        </Form.Group>

                                        <Form.Group className="form-layout">
                                        <Form.Label>CVV :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder='cvv'
                                            maxLength={3}
                                            required
                                        />
                                        </Form.Group>

                                        <div style={{display:'flex',justifyContent:'center'}}>
                                            <Button className="editBtn" type="submit" 
                                            style={{margin:'20px 0px', 
                                            backgroundColor:'#F44C0C',
                                            height:'45px', 
                                            border:'none'}}> Add</Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                            )}

                            {modalEdit && (
                            <div className="modal">
                                <div className="modal-content">
                                <span className="close" onClick={() => toggleEditcreditCardModal()}>&times;</span>
                                    <h5 className='add-user-text' style={{color:'#F44C0C', fontWeight:'700'}}>Edit creditCard</h5>
                                    <Form onSubmit={handleUpdatecreditCard} style={{maxHeight:'550px',overflow:'auto'}}>
                                        <Form.Group className="form-layout">
                                        <Form.Label>Credit card number :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="creditCardNumber"
                                            value={creditCard.creditCardNumber}
                                            onChange={handleEditChange}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            onBlur={handlecreditCardEditCheck}
                                            maxLength={16}
                                            required
                                        />
                                        {creditCardExists && (
                                            <div className="mt-2" style={{ color: 'red' }}>
                                            *This credit card is already in use.
                                            </div>
                                        )
                                        }
                                        </Form.Group>

                                        <Form.Group className="form-layout">
                                            <Form.Label>Card Type :</Form.Label>
                                            <Form.Control
                                                as="select"
                                                placeholder="Select card type"
                                                name="cardType"
                                                value={creditCard.cardType}
                                                onChange={handleEditChange}
                                                defaultValue={creditCard.cardType}
                                                required
                                            >
                                                <option value="" disabled hidden>Select card type</option>
                                                <option value="Visa">Visa</option>
                                                <option value="Mastercard">Mastercard</option>
                                                <option value="AmericanExpress">American Express</option>
                                                <option value="UnionPay">UnionPay</option>
                                                <option value="JCB">JCB</option>
                                            </Form.Control>
                                        </Form.Group>


                                        <Form.Group className="form-layout">
                                        <Form.Label>Expiry date :</Form.Label>
                                        <Form.Control
                                            type="Month"
                                            name="expiryDate"
                                            value={creditCard.expiryDate || ''}
                                            onChange={handleEditChange}
                                            placeholder='Expiry date'
                                            defaultValue={creditCard.expiryDate}
                                            required
                                        />
                                        </Form.Group>

                                        <Form.Group className="form-layout">
                                        <Form.Label>CVV :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cvv"
                                            value={creditCard.cvv}
                                            onChange={handleEditChange}
                                            placeholder='cvv'
                                            maxLength={3}
                                            required
                                        />
                                        </Form.Group>

                                        <div style={{display:'flex',justifyContent:'center'}}>
                                            <Button className="editBtn" type="submit" 
                                            style={{margin:'20px 0px', 
                                            backgroundColor:'#F44C0C',
                                            height:'45px', 
                                            border:'none'}}> Edit</Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default MyCreditCard;
