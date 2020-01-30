var mongoose = require("mongoose");
var FIR = mongoose.Schema({
    name : String,
    document : String,
    data_created : Date.now,
});


module.exports = mongoose.model('FIR', FIR);