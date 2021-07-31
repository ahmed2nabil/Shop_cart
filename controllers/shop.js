const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    const prods = products.map((products) => {
      return {title: products.title,
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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then((product) => {
  const prod =  {title: product.title,
      description : product.description,
      imageUrl : product.imageUrl,
      price : product.price
    };
  res.status(200).json(prod);
    })
    .catch((err)=> {
      res.status(404).json(err);
    });

};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    const prods = products.map((products) => {
      return {title: products.title,
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

exports.getCart = (req, res, next) => {
Cart.find()
.then(cart => {
  Product.find()
})
};

exports.postCart = (req, res, next) => {
const prodId  = req.body.productId
  let fetchedCart;
let newQuantity = 1;
Cart.findByPk(req.cartId)
.then(cart => {
  fetchedCart = cart;
  return cart.getProducts({where : { id : prodId}});
})
.then(products => {
  let product;
  if(products.length > 0){
    product = products[0];
  }
  if(product) {
    const oldQuantity = product.cartItem.quantity;
    newQuantity += oldQuantity;
  return product;
  }
return Product.findByPk(prodId)
.then(product => {
  return fetchedCart.addProduct(product , {
    through : {quantity : newQuantity}
  })
})
.catch(err => { res.status(400).json(err)})
})
.then(data => {
  res.status(200).json(data);
})
.catch(err => { res.status(400).json(err)})

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.postOrders = (req, res, next) => {
};

exports.getOrders = (req, res, next) => {
};
