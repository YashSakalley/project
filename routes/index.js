var express = require('express');
var router = express.Router();
var config = require("../config");
var aadhaar = require("../model/aadhaar");
/* GET home page. */
router.get('/', function(req, res, next) {
  var number = req.flash('num');
  var msg = req.flash('msg');
  res.render('index', {"aadhaar" : number, "msg" : msg});
});

//OTP Logic

var client = require("twilio")(config.accountSID, config.authToken);

router.post('/', (req, res) => {
  aadhaar.findOne({aadhaar_number : req.body.aadhaar})
  .then((data) => {
    var global_data = data;
    client
    .verify
    .services(config.serviceID)
    .verifications
    .create({
        to : `+${data.phone}`,
        channel : "sms"
    })
    .then((data) => {
      req.flash('num', global_data.aadhaar_number);
      var phoneStr = global_data.phone.toString()
      req.flash('msg', `OTP has been sent to your registered number i.e XXXXXXX${phoneStr[9]+phoneStr[10]+phoneStr[11]}`);
      return res.redirect('/');    
    })
    .catch((err) => {
        console.log("error occured during OTP logic ", err);
    });
  })
  .catch((err) => {
    console.log(err);
  })
  
});

router.post('/verify', (req, res) => {
  console.log(req.body);
  aadhaar.findOne({aadhaar_number : req.body.aadhaar})
  .then((data) => {
    console.log(req.body.code);
    client
    .verify
    .services(config.serviceID)
    .verificationChecks
    .create({
        to : `+${data.phone}`,
        code : req.body.code
    })
    .then((data) => {
        if(data.valid == true)
        {
          res.status(200).send(data);
        }
        else
        {
          req.flash('msg', 'OTP is wrong');
          res.redirect('/');
        }
    })
    .catch((err) => {
        console.log("error occured during verifying OTP ", err);
        req.flash('msg','OTP verification is expired generate it again');
        res.redirect('/');
    });
  })
  .catch((err) => {
    console.log("error occured as : ", err);
  });  
  
});

module.exports = router;
