var mongoose = require("mongoose");

var aadhaar = mongoose.Schema({
    aadhaar_number : Number,
    name : String,
    phone : Number,
    address : String
});

module.exports = mongoose.model("aadhaar", aadhaar);