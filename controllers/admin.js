const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title : title,
    price : price,
    imageUrl : imageUrl,
    description : description
  })
  .then((result)=> {
    res.status(201).json({msg: "Product Created"});
  })
  .catch((err) => {
    res.status(400).json({err:err});
  });
};

exports.putEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
Product.findByPk(prodId)
.then(prod => {
prod.title = updatedTitle;
prod.price = updatedPrice;
prod.description = updatedDesc;
prod.imageUrl = updatedImageUrl;
return prod.save();
})
.then(result => {
  res.status(200).json({msg:'Updated',prod : result})
})
.catch(err => {
res.status(404).json(err);
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
  res.status(404).json(err);
});
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(prod => {
    return prod.destroy();
  })
  .then(result => {
    res.status(200).json('DELETED');
  })
  .catch((err)=> {
    res.status(404).json(err);
  });
};
