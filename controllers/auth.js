'use strict'
const User = require("../models/user");
const cart = require("../models/cart");

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const {validationResult} =require('express-validator/check');

const config = require('../util/config');
// const Product = require("../models/product");

const dbConnection = require("../database/connection")
const queryList = require("../database/queries").queryList;
exports.postSignup = async (req,res,next) => {
const email           = req.body.email;
const username           = req.body.username;
const password        = req.body.password;
/**
 *  check the validation
 * check if email user is already exists
 * create user if not exists
 * create cart for that user id
 * send the response
 */
// const errors = validationResult(req);
// if (!errors.isEmpty()) {
//   console.log(errors.array());
//   return res.status(422).json({
//     validationErrors: errors.array()
//   });
// }
const userDoc = await dbConnection.dbQuery(queryList.FIND_USER_QUERY, [email]) 
if(userDoc.rows.length) {
    return res.status(403).json('Email is already exists');
}
const hashedPassword = await bcrypt.hash(password,12);

const newUser = await dbConnection.dbQuery(queryList.ADD_USER_QUERY,[username, password, email])
console.log
if(!newUser) {
  return res.status(400).json({err: "User created failed"})
}
const userId = newUser.rows[0].user_id;
 let token = jwt.sign({id: userId},config.SECRET,{
        expiresIn : '3h' //expires in 24 hours
    })
    res.status(200).json({msg :'Signed up successfully', token : token,UserID :JSON.stringify(userId)});
} 

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
/**
 * check the validation
 * check if user email exists
 * check matching password
 * send the token
 */
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