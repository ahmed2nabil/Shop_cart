'use strict'
const User = require("../models/user");
const cart = require("../models/cart");

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const {validationResult} =require('express-validator/check');

const config = require('../util/config');
const Logger = require('../services/loggerService')

const dbConnection = require("../database/connection")
const queryList = require("../database/queries").queryList;
const { emit } = require("nodemon");

const logger = new Logger('authController');
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
    logger.error('User is already exists ', JSON.stringify(userDoc.rows));
    return res.status(403).json('Email is already exists');
}
const hashedPassword = await bcrypt.hash(password,12);

const newUser = await dbConnection.dbQuery(queryList.ADD_USER_QUERY,[username, hashedPassword, email])
if(!newUser) {
    logger.error("User created failed ", JSON.stringify(newUser))
  return res.status(400).json({err: "User created failed"})
}
const userId = newUser.rows[0].user_id;
const newCart = await dbConnection.dbQuery(queryList.CREATE_CART_USER_QUERY,[userId]);
 let token = jwt.sign({id: userId},config.SECRET,{
        expiresIn : '3h' //expires in 24 hours
    })
    logger.info('Signed up Successfully',JSON.stringify(userId));
    res.status(200).json({msg :'Signed up successfully', token : token,UserID :JSON.stringify(userId)});
} 

exports.postLogin = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
/**
 * check the validation
 * check if user email exists
 * check matching password
 * send the token
 */
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({
    //     oldInput: {
    //       email: email,
    //       password: password
    //     },
    //     validationErrors: errors.array()
    //   });
    // }
 const user = await dbConnection.dbQuery(queryList.FIND_USER_QUERY,[email])
    if(!user.rows.length){
        logger.error("Invalid Email ", JSON.stringify(email))
       return res.status(401).json({msg : 'Invalid Email or Password'})
    }
    
 const passwordmatch = await bcrypt.compare(password,user.rows[0].password)
        if(passwordmatch) {
            var token = jwt.sign({id: user.rows[0].user_id },config.SECRET,{
                expiresIn : 86400 //expires in 24 hours
            })
            logger.info('Succesfully Login token : ', token)
            res.status(200).json({msg : 'Succesfully Logged In',token : token , userId : user.rows[0].user_id})
        } else {
            logger.error('Invalid Password', JSON.stringify(password))
        res.status(401).json({msg : 'Invalid Email or Password'})  
        }      
} 
