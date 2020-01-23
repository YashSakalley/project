var express = require('express');
var router = express.Router();
var config = require("../config");
var aadhaar = require("../model/aadhaar");

//front page
router.get('/', function(req, res, next) {
  var number = req.flash('num');
  var msg = req.flash('msg');
  var valid = req.flash('valid');
  res.render('index', {"aadhaar" : number, "msg" : msg, "valid": valid});
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
      req.flash('valid', '1')
      var phoneStr = global_data.phone.toString()
      req.flash('msg', `OTP has been sent to your registered number i.e XXXXXXX${phoneStr[9]+phoneStr[10]+phoneStr[11]}`);
      return res.redirect('/');    
    })
    .catch((err) => {
        console.log("error occured during OTP logic ", err);
        res.send("MAX verification attempts reach : try again later");
    });
  })
  .catch((err) => {
    req.flash('msg', 'Wrong Aadhar number')
    req.flash('valid', '0');
    console.log(err);
    res.redirect('/');
  })
  
});

//OTP verifying logic 
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
          req.flash('valid', '1');
          req.flash('auth', 'yes');
          res.redirect('/fir');
        }
        else
        {
          req.flash('valid', '0')
          req.flash('auth', 'no');
          req.flash('msg', 'OTP is wrong');
          res.redirect('/');
        }
    })
    .catch((err) => {
        console.log("error occured during verifying OTP ", err);
        req.flash('valid', '0');
        req.flash('auth', 'no');
        req.flash('msg','OTP verification is expired generate it again');
        res.redirect('/');
    });
  })
  .catch((err) => {
    console.log("error occured as : ", err);
    req.flash('msg', 'Wrong Aadhar number')
    req.flash('auth', 'no');
    req.flash('valid', '0');
    res.redirect('/');
  });  
});


module.exports = router;
