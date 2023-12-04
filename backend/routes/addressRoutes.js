const route = require("express").Router();

const { getUserAddress, 
    addUserAddress, 
    updateUserAddress, 
    deleteUserAddress,
    getDistricts,
    getProvinces,
    getZipcode } = require("../controllers/addressController");

route.route("/getAddress/:userId").get(getUserAddress);
route.route("/addAddress/:userId").post(addUserAddress);
route.route("/updateAddress/:userId").put(updateUserAddress);
route.route("/deleteAddress/:userId").delete(deleteUserAddress);
route.route("/getDistricts/:province?").get(getDistricts);
route.route("/getProvinces").get(getProvinces);
route.route("/getZipcodes/:district/:province").get(getZipcode);

module.exports = route;