/********************************************************************
 *   MyAddress.jsx                                                  *
 *                                                                  *
 *   This page is displaying user's address information.            *
 *   It typically provides options for viewing, adding, editing,    *
 *   and deleting addresses associated with the user's account.     *
 *                                                                  *
 ********************************************************************/


import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AccountNav from "./AccountNav";

function MyAddress() {
  /***************************************** Initialize State ***********************************************/
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    telephoneNumber: "",
    addressinfo: "",
    district: "",
    province: "",
    zipcode: "",
  });
  const [address, setAddress] = useState({
    address_id: "",
    user_id: "",
    fname: "",
    lname: "",
    telephoneNumber: "",
    addressinfo: "",
    district: "",
    province: "",
    zipcode: "",
    addressDefault: "",
  });
  /**********************************************************************************************************/

  /******************************************* Toggle Modal ************************************************/
  const toggleAddAddressModal = () => {
    setModalOpen(!ModalOpen);
  };
  const toggleEditAddressModal = () => {
    setModalEdit(!modalEdit);
  };
  /**********************************************************************************************************/

  /******************************************* Handle Submit ************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const addressResponse = await fetch(
        `http://localhost:3000/address/addAddress/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (addressResponse.ok) {
        const data = await addressResponse.json();
        console.log(data); // Log the response data
        window.location.href = "/myAddress";
      } else {
        console.error("Error adding address:", addressResponse.status);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  /**********************************************************************************************************/

  /****************************************** Get Address USer **********************************************/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/address/getAddress/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error("Error fetching address:", error.message);
      }
    };

    fetchData();
  }, [userId]);
  /**********************************************************************************************************/

  /******************************************* Handle Edit Button *******************************************/
  const handleEdit = async (addressId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/address/getOneAddress/${addressId}`
      );
      if (response.ok) {
        const addressData = await response.json();
        console.log("Product data:", addressData);
        setAddress({
          address_id: addressData[0].address_id,
          user_id: addressData[0].user_id,
          fname: addressData[0].address_fname,
          lname: addressData[0].address_lname,
          telephoneNumber: addressData[0].address_telephone_number,
          addressinfo: addressData[0].address_detail,
          district: addressData[0].district,
          province: addressData[0].province,
          zipcode: addressData[0].zipcode,
          addressDefault: addressData[0].address_default,
        });
        console.log("address:", address);
        setModalEdit(true);
        setSelectedAddress(addressId);
      } else {
        console.error("Failed to fetch address data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  /**********************************************************************************************************/

  /*************************************** Update Address **************************************************/
  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    address.district = formData.district;
    address.province = formData.province;
    address.zipcode = formData.zipcode;

    try {
      const response = await fetch(
        `http://localhost:3000/address/updateAddress/${userId}"`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        }
      );

      if (response.ok) {
        console.log("Product updated successfully");
        window.location.reload();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  /*************************************************************************************************/

  /******************************************* Handle Delete ************************************************/
  const handleDelete = (addressId) => {
    console.log("Delete address with id:", addressId);
    fetch(`http://localhost:3000/address/deleteAddress/${addressId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        window.alert("Product deleted successfully");
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
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
    setAddress({ ...address, [name]: value });
  };

  /**********************************************************************************************************/

  /************************************ Handle Address Selection ********************************************/
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zipcodes, setZipcodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/address/getProvinces",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const provinceValues = data.map((item) => item.province);

        setProvinces(provinceValues);
      } catch (error) {
        console.error("Error fetching provinces:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleProvinceChange = async (selectedProvince) => {
    setDistricts([]);
    setZipcodes([]);

    if (selectedProvince !== "") {
      try {
        const response = await fetch(
          `http://localhost:3000/address/getDistricts/${selectedProvince}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const districtValues = data.map((item) => item.district);

        setDistricts(districtValues);
      } catch (error) {
        console.error("Error fetching districts:", error.message);
      }
    }
  };

  const handleDistrictChange = async (selectedDistrict) => {
    setZipcodes([]);

    const selectedProvince = provinces.find(
      (province) => province === formData.province
    );
    if (selectedDistrict !== "" && selectedProvince) {
      try {
        const response = await fetch(
          `http://localhost:3000/address/getZipcodes/${selectedDistrict}/${selectedProvince}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const zipcodeValues = data.map((item) => item.zipcode);

        setZipcodes(zipcodeValues);
      } catch (error) {
        console.error("Error fetching zipcodes:", error.message);
      }
    }
  };
  /**********************************************************************************************************/

  return (
    <div>
      <Navbar />
      <div
        className="purchases-container"
        style={{
          paddingTop: "35px",
          paddingBottom: "35px",
          backgroundColor: "#F1F0F0",
          minHeight: "640px",
        }}
      >
        <Container style={{ maxWidth: "1080px" }}>
          <div className="heading">
            <h4 style={{ fontSize: "20px" }}>{username}'s Account</h4>
          </div>

          <Row>
            <AccountNav />
            <Col md={10}>
              <div
                className="infoBox"
                style={{ gap: "5px", minHeight: "450px" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h5>My Address</h5>
                  <button
                    className="btn btn-primary"
                    style={{
                      float: "right",
                      backgroundColor: "#F44C0C",
                      border: "none",
                    }}
                    onClick={() => setModalOpen(true)}
                  >
                    Add New Address
                  </button>
                </div>
                <hr style={{ opacity: "100%" }} />
                {addresses.length === 0 ? (
                  <p>You don't have any address in the system.</p>
                ) : (
                  addresses.map((address) => (
                    <div key={address.address_id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          margin: "0 30px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: "wrap",
                            maxWidth: "500px",
                          }}
                        >
                          <p>{`${address.address_fname} ${address.address_lname} | ${address.address_telephone_number}`}</p>
                          <p>{`${address.address_detail}, ${address.district}, ${address.province}, ${address.zipcode}`}</p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            minWidth: "105px",
                          }}
                        >
                          {address.address_default === 0 && (
                            <React.Fragment>
                              <p
                                onClick={() => handleEdit(address.address_id)}
                                style={{
                                  color: "#F44C0C",
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                              >
                                Edit
                              </p>
                              <p style={{ color: "#F44C0C" }}>/</p>
                              <p
                                onClick={() => handleDelete(address.address_id)}
                                style={{ color: "#F44C0C", cursor: "pointer" }}
                              >
                                Delete
                              </p>
                            </React.Fragment>
                          )}
                          {address.address_default === 1 && (
                            <p
                              onClick={() => handleEdit(address.address_id)}
                              style={{
                                color: "#F44C0C",
                                cursor: "pointer",
                                marginRight: "10px",
                              }}
                            >
                              Edit
                            </p>
                          )}
                        </div>
                      </div>
                      <hr style={{ opacity: "100%", margin: "20px" }} />
                    </div>
                  ))
                )}
              </div>
              {ModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <span
                      className="close"
                      onClick={() => toggleAddAddressModal()}
                    >
                      &times;
                    </span>
                    <h5
                      className="add-user-text"
                      style={{ color: "#F44C0C", fontWeight: "700" }}
                    >
                      Add New Address
                    </h5>
                    <Form
                      onSubmit={handleSubmit}
                      style={{ maxHeight: "550px", overflow: "auto" }}
                    >
                      <Form.Group className="form-layout">
                        <Form.Label>First Name :</Form.Label>
                        <Form.Control
                          type="text"
                          name="fname"
                          value={formData.fname}
                          onChange={handleChange}
                          placeholder="First Name"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Last Name :</Form.Label>
                        <Form.Control
                          type="text"
                          name="lname"
                          value={formData.lname}
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Telephone Number :</Form.Label>
                        <Form.Control
                          type="text"
                          name="telephoneNumber"
                          value={formData.telephoneNumber}
                          onChange={handleChange}
                          placeholder="Telephone Number"
                          maxLength={10}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Address :</Form.Label>
                        <Form.Control
                          type="text"
                          name="addressinfo"
                          value={formData.addressinfo}
                          onChange={handleChange}
                          placeholder="Address"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Province:</Form.Label>
                        <Form.Control
                          as="select"
                          name="province"
                          id="province"
                          value={formData.province}
                          required
                          onChange={(e) => {
                            handleChange(e);
                            handleProvinceChange(e.target.value);
                          }}
                        >
                          <option value="">Select Province</option>
                          {provinces.map((province, index) => (
                            <option key={index} value={province}>
                              {province}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>District:</Form.Label>
                        <Form.Control
                          as="select"
                          name="district"
                          value={formData.district}
                          required
                          onChange={(e) => {
                            handleChange(e);
                            handleDistrictChange(e.target.value);
                          }}
                        >
                          <option value="">Select District</option>
                          {districts.map((district, index) => (
                            <option key={index} value={district}>
                              {district}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Zipcode:</Form.Label>
                        <Form.Control
                          as="select"
                          name="zipcode"
                          value={formData.zipcode}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Zipcode</option>
                          {zipcodes.map((zipcode, index) => (
                            <option key={index} value={zipcode}>
                              {zipcode}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          className="editBtn"
                          type="submit"
                          style={{
                            margin: "20px 0px",
                            backgroundColor: "#F44C0C",
                            height: "45px",
                            border: "none",
                          }}
                        >
                          {" "}
                          Add
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              )}

              {modalEdit && (
                <div className="modal">
                  <div className="modal-content">
                    <span
                      className="close"
                      onClick={() => toggleEditAddressModal()}
                    >
                      &times;
                    </span>
                    <h5
                      className="add-user-text"
                      style={{ color: "#F44C0C", fontWeight: "700" }}
                    >
                      Edit Address
                    </h5>
                    <Form
                      onSubmit={handleUpdateAddress}
                      style={{ maxHeight: "550px", overflow: "auto" }}
                    >
                      <Form.Group className="form-layout">
                        <Form.Label>First Name :</Form.Label>
                        <Form.Control
                          type="text"
                          name="fname"
                          value={address.fname}
                          onChange={handleEditChange}
                          placeholder="First Name"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Last Name :</Form.Label>
                        <Form.Control
                          type="text"
                          name="lname"
                          value={address.lname}
                          onChange={handleEditChange}
                          placeholder="Last Name"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Telephone Number :</Form.Label>
                        <Form.Control
                          type="text"
                          name="telephoneNumber"
                          value={address.telephoneNumber}
                          onChange={handleEditChange}
                          placeholder="Telephone Number"
                          maxLength={10}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Address :</Form.Label>
                        <Form.Control
                          type="text"
                          name="addressinfo"
                          value={address.addressinfo}
                          onChange={handleEditChange}
                          placeholder="Address"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Province:</Form.Label>
                        <Form.Control
                          as="select"
                          name="province"
                          id="province"
                          value={formData.province}
                          required
                          onChange={(e) => {
                            handleChange(e);
                            handleProvinceChange(e.target.value);
                          }}
                        >
                          <option value="">Select Province</option>
                          {provinces.map((province, index) => (
                            <option key={index} value={province}>
                              {province}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>District:</Form.Label>
                        <Form.Control
                          as="select"
                          name="district"
                          value={formData.district}
                          required
                          onChange={(e) => {
                            handleChange(e);
                            handleDistrictChange(e.target.value);
                          }}
                        >
                          <option value="">Select District</option>
                          {districts.map((district, index) => (
                            <option key={index} value={district}>
                              {district}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <Form.Group className="form-layout">
                        <Form.Label>Zipcode:</Form.Label>
                        <Form.Control
                          as="select"
                          name="zipcode"
                          value={formData.zipcode}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Zipcode</option>
                          {zipcodes.map((zipcode, index) => (
                            <option key={index} value={zipcode}>
                              {zipcode}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          className="editBtn"
                          type="submit"
                          style={{
                            margin: "20px 0px",
                            backgroundColor: "#F44C0C",
                            height: "45px",
                            border: "none",
                          }}
                        >
                          {" "}
                          Add
                        </Button>
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

export default MyAddress;
