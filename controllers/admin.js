const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
Product.create({
    title : title,
    price : price,
    imageUrl : imageUrl,
    description : description,
    userId : req.userId
  })
  .then((result)=> {
    res.status(201).json({msg: "Product Created"});
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.putEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
Product.findByPk(prodId)
.then(prod => {
  if(req.userId !== prod.userId){
    res.status(403).json({msg:'You are not allowed to do that'})
  } else {
prod.title = updatedTitle;
prod.price = updatedPrice;
prod.description = updatedDesc;
prod.imageUrl = updatedImageUrl;
 prod.save().then(result => {
  res.status(200).json({msg:'Updated',prod : result})
}).catch(err => { 
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 })
  }
})
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
})
};

exports.getProducts = (req, res, next) => {
Product.findAll()
.then(products => {
  const prods = products.map((products) => {
    return {
      id : products.id,
      title: products.title,
      description : products.description,
      imageUrl : products.imageUrl,
      price : products.price
    };
  });
  res.status(200).json(prods);
})
.catch((err)=> {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
});
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(prod => {
    if(req.userId !== prod.userId){
      res.status(403).json({msg:'You are not allowed to do that'})
    }
    else {
      prod.destroy()
      .then(result => {
        res.status(200).json('DELETED');
      })
   .catch((err)=> {  
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    });
    }
  })
 .catch((err)=> {  
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};
