'use strict'
const User = require("../models/user");
const cart = require("../models/cart");

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} =require('express-validator/check');

// const transport = nodemailer.createTransport(
//     sendgridTransport({
//         auth : {
//             api_key:
//     }
//     }));
let userData ;
const config = require('../util/config');
const Product = require("../models/product");


exports.postSignup = (req,res,next) => {
const email           = req.body.email;
const name           = req.body.name;
const password        = req.body.password;
var token;

const errors = validationResult(req);
if (!errors.isEmpty()) {
  console.log(errors.array());
  return res.status(422).json({
    oldInput: {
      email: email,
      password: password,
      confirmPassword: req.body.confirmPassword
    },
    validationErrors: errors.array()
  });
}
User.findOne({where : {email : email}})
.then(userDoc => {
if(userDoc) {
    res.status(403).json('Email is already exists');
}
return bcrypt.hash(password,12);

})
.then(hashedPassword => {
    return User.create({
        email : email,
        password : hashedPassword,
        name : name
    });
})
.then(userRes => {
    userData = userRes;
  return  userRes.createCart();
})
.then(cart => {
 token = jwt.sign({id: userData.id },config.secret,{
        expiresIn : 86400 //expires in 24 hours
    })
    res.status(200).json({msg :'Signed up successfully', token : token,userId :userData.id});
})

.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
})
} 

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
      });
    }
User.findOne({where: {email : email}})
.then(user => {
    if(!user){
        res.status(401).json({msg : 'Invalid Email or Password'})
    }
    userData = user;
    bcrypt.compare(password,user.password)
    .then(resmatching => {
        if(resmatching) {
            var token = jwt.sign({id: userData.id },config.secret,{
                expiresIn : 86400 //expires in 24 hours
            })
            res.status(200).json({msg : 'Succesfully Logged In',token : token})
        } else {
        res.status(401).json({msg : 'Invalid Email or Password'})  
        }      
    })
    .catch(err => {next(err)})
})
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
})
} 

exports.postReset = (req,res,next) => {

}