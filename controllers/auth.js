'use strict'
const User = require("../models/user");
const cart = require("../models/cart");

const bcrypt = require('bcryptjs');

exports.postSignup = (req,res,next) => {
const email           = req.body.email;
const name           = req.body.name;
const password        = req.body.password;
const confirmPassword = req.body.confirmPassword;

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
  return  userRes.createCart();
})
.then(cart => {
    res.status(200).json('Signed up successfully');
})
.catch(err => {
next(err);
})
} 

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
User.findOne({where: {email : email}})
.then(user => {
    if(!user){
        res.status(401).json({msg : 'Invalid Email or Password'})
    }
    bcrypt.compare(password,user.password)
    .then(resmatching => {
        if(resmatching) {
            res.status(200).json({msg : 'Succesfully Logged In'})
        } else {
        res.status(401).json({msg : 'Invalid Email or Password'})  
        }      
    })
    .catch(err => {next(err)})
})
.catch(err => {
    next(err);
})
} 

exports.postLogout = (req,res,next) => {
    
} 

exports.postReset = (req,res,next) => {

}