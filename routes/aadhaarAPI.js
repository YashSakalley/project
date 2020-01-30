var express = require("express");
var router = express.Router();
var aadhaar = require("../model/aadhaar")

router.get('/', (req, res) => {
    aadhaar.find({}).then((data) => {
        res.json(data);
    })
        .catch((err) => {
            console.log(err);
            res.send("error occcured");
        })
});
router.post('/', (req, res) => {
    var obj = new aadhaar({
        aadhaar_number: req.body.a_num,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    });

    obj.save(function (err, object, isSaveSuccessful) {
        if (err) {
            console.log('Data saving not Successful');
            console.log(err);
        }
        if (isSaveSuccessful === 1) {
            console.log('Data Saved Successfull');
        }
    });
    res.send("done");
});


module.exports = router;