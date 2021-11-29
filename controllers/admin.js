'use strict'
const { validationResult } = require('express-validator/check');

const Product = require('../models/product.js');

const dbConnection = require("../database/connection");
const queryList = require("../database/queries").queryList;
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed, entered data is incorrect.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  const productresult = await dbConnection.dbQuery(queryList.ADD_PRODUCT_QUERY,[title, price, imageUrl, description, req.userId])
  if(!productresult){
    return res.status(400).json({msg: 'Failed to Created Product'})
  }
    res.status(201).json({msg: "Product Created" , product_id : productresult.rows[0].product_id});

};

exports.putEditProduct =  async(req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed, entered data is incorrect.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  const  prod = await dbConnection.dbQuery(queryList.GET_PROUDCT_DETAILS_QUERY,[prodId])
  if(req.userId !== prod.rows[0].user_id){
  return  res.status(403).json({msg:'You are not allowed to do that'})
  } else {
const updatedProd = await dbConnection.dbQuery(queryList.UPDATE_PRODUCT_QUERY,[updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, req.userId, prodId])
  res.status(200).json({msg:`Updated  Product ${updatedTitle}Successfully `})


}
}

exports.getProducts = async (req, res, next) => {
const products = await dbConnection.dbQuery(queryList.GET_ALL_PROUDCTS_QUERY);
  const prods = products.rows.map((products) => {
    return {
      id : products.product_id,
      title: products.title,
      description : products.description,
      imageUrl : products.image_url,
      price : products.price
    };
  });
  res.status(200).json(prods);
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const prod = await dbConnection.dbQuery(queryList.GET_PROUDCT_DETAILS_QUERY,[prodId]);
    if(req.userId !== prod.rows[0].user_id){
      res.status(403).json({msg:'You are not allowed to do that'})
    }
    else {
      const result  = await dbConnection.dbQuery(queryList.DELETE_PRODUCT_QUERY,[prodId]);
        res.status(200).json({msg :'DELETED'});
    }
}
