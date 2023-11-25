import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Form, Button } from 'react-bootstrap'
import './css/Users.css';

function Users() {

    /************************************** Initialize State ***************************************/
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        email: '',
        fname: '',
        lname: '',
        telephone_number: '',
    });
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [emailExists, setEmailExists] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const baseURL = '../../../public/';
    /***********************************************************************************************/

    /************************************* Query Users *********************************************/
    useEffect(() => {
        fetch('http://localhost:3000/system/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setFilteredUsers(data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);
    /*************************************************************************************************/

    /************************************** Search Users *********************************************/
    useEffect(() => {
        const results = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };
    /*************************************************************************************************/

    /************************************** Delete Users *********************************************/
    const handleDelete = userId => {
        fetch(`http://localhost:3000/system/users/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const updatedUsers = users.filter(user => user.user_id !== userId);
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);

                window.alert('User deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };
    /*************************************************************************************************/

    /************************************* Toggle System **********************************************/
    const toggleAddUserModal = () => {
        setShowAddUserModal(!showAddUserModal);
    };

    const resetFormFields = () => {
        setNewUser({
            username: '',
            password: '',
            email: '',
            fname: '',
            lname: '',
            telephone_number: '',
        });
        setEmailExists(false);
        setUsernameExists(false);
        setFormSubmitted(false);
    };
    /*************************************************************************************************/

    /**************************************** Query Email ************************************************/
    const handleEmailCheck = async () => {
        try {
            const response = await fetch(`http://localhost:3000/auth/check-email?email=${newUser.email}`);
            const data = await response.json();
            setEmailExists(data.exists);
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };
    /*****************************************************************************************************/


    /********************************************** Query Username *********************************************/
    const handleUsernameCheck = async () => {
        try {
            const response = await fetch(`http://localhost:3000/auth/check-username?username=${newUser.username}`);
            const data = await response.json();
            setUsernameExists(data.exists);
        } catch (error) {
            console.error('Error checking username:', error);
        }
    };
    /************************************************************************************************************/

    /********************************************** Handle Change *********************************************/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });

        if (name === 'email') {
            setEmailExists(false);
        }

        if (name === 'username') {
            setUsernameExists(false);
        }

    };
    /**********************************************************************************************************/

    /************************************************ Add User ***********************************************/
    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        /******************** Condition to Submit *********************/
        if (emailExists) {
            emailRef.current.focus();
            return;
        }

        if (usernameExists) {
            usernameRef.current.focus();
            return;
        }
        /**************************************************************/

        fetch('http://localhost:3000/system/addusers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setShowAddUserModal(false);
                window.alert('User added successfully');
                window.location.reload()
            })
            .catch((error) => {
                console.error('Error adding user:', error);
            });
    };
    /**********************************************************************************************************/


    return (
        <div className="wrapper">
            <Header />
            <Sidebar />
            {/* Users Content */}
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>Users</h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header">
                                    <input
                                        type="text"
                                        placeholder="Search by username..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="search-input"
                                    />
                                    <span className="add-user-icon ms-3" onClick={toggleAddUserModal}>
                                        <i className="nav-icon fas fa-user-plus" />
                                    </span>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>User ID</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>FName</th>
                                                <th>LName</th>
                                                <th>Tel</th>
                                                <th>Action</th>
                                                {/* Add more table headers as needed */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user.user_id}>
                                                    <td className="text-cell">{user.user_id}</td>
                                                    <td className="text-cell">{user.username}</td>
                                                    <td className="text-cell">{user.email}</td>
                                                    <td className="text-cell">{user.fname}</td>
                                                    <td className="text-cell">{user.lname}</td>
                                                    <td className="text-cell">{user.telephone_number}</td>
                                                    <td className="text-cell">
                                                        <button onClick={() => handleDelete(user.user_id)} className="delete-button">
                                                            Delete
                                                        </button>
                                                    </td>
                                                    {/* Display other user information */}
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
                {showAddUserModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => {
                                toggleAddUserModal();
                                resetFormFields();
                            }}>
                                &times;
                            </span>
                            <h5 className='add-user-text'>Add New User</h5>
                            <Form onSubmit={handleAddUser}>
                                <Form.Group className="form-layout" controlId="email">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleChange}
                                        onBlur={handleEmailCheck}
                                        ref={emailRef}
                                        required
                                    />
                                    {emailExists && (
                                        <div className="mt-2" style={{ color: 'red' }}>
                                            *This email is already in use.
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="username">
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleChange}
                                        onBlur={handleUsernameCheck}
                                        ref={usernameRef}
                                        required
                                    />
                                    {usernameExists && (
                                        <div className="mt-2" style={{ color: 'red' }}>
                                            *This username is already in use.
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleChange}
                                        ref={passwordRef}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="fname">
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        name="fname"
                                        value={newUser.fname}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-layout" controlId="lname">
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        name="lname"
                                        value={newUser.lname}
                                        onChange={handleChange}
                                        required
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

export default Users;
