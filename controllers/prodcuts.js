const Product = require('../models/product');

exports.postAddProdcut =  (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
      title : title,
      imageUrl: imageUrl,
      price : price ,
      description  : description,
      userId : 1 //remeber to update this
    }).then(prodData => {
      res.status(200).json({msg : 'Created', product : prodData})
    })
    .catch(err => {res.status(401).json({msg:err})});
  };

exports.getProducts = (req, res, next) => {
Product.findAll({attributes: ['id','title', 'price','imageUrl','description']})
.then(products => {
  res.status(200).json(products);
})
.catch(err => res.status(401).json({msg:err}));
  
  };

exports.putEditProduct = (req,res,next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  })
  .then(result => {
    res.status(301).json({mag: 'Updated Successfully',product : result});
  })
  .catch(err => res.status(401).json({msg:err}));
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.status(200).json({msg:'Deleted Successfully'})
    })
  .catch(err => res.status(401).json({msg:err}));
    
}