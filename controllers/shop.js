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
  .catch((err)=> {res.status(404).json(err); });
};

exports.getCart = (req, res, next) => {
  Cart.findOne({where: {userId : req.userId}})
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json(products);
                })
        .catch((err)=> {res.status(404).json(err); });
    })
    .catch((err)=> {res.status(404).json(err); });
};

exports.postCart = (req, res, next) => {
const prodId  = req.body.productId
  let fetchedCart;
let newQuantity = 1;
Cart.findOne({where :{userId : req.userId}})
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
})
.then(product => {
  return fetchedCart.addProduct(product , {
    through : {quantity : newQuantity}
  })
})
.then(data => {
  res.status(200).json({msg : "added to the Cart",data:data});
})
.catch(err => { res.status(403).json(err)})

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
 Cart.findOne({where : {userId : req.userId}})
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrders = (req, res, next) => {
};

exports.getOrders = (req, res, next) => {
};
