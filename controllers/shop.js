const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');


const ITEMS_PER_PAGE = 2;



exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.count()
  .then(numProds=> {
    totalItems = numProds;
   return Product.findAll({ offset: (page - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE  })
  })
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
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.count().then(numProds=> {
    totalItems = numProds;
   return Product.findAll({ offset: (page - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE  })
  })
  .then(products => {
    const prods = products.map((products) => {
      return {title: products.title,
        description : products.description,
        imageUrl : products.imageUrl,
        price : products.price
      };
    });
    res.status(200).json({prods :prods});
  })
  .catch((err)=> {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
   });
};

exports.getCart = (req, res, next) => {
  Cart.findOne({where: {userId : req.userId}})
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json(products);
                })
        .catch((err)=> {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
         });
    })
    .catch((err)=> {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
     });
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
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
})

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
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postOrders = (req, res, next) => {
let fetchedCart ; 
Cart.findOne({where : {userId :req.userId}})
.then(cart  => {
  fetchedCart = cart ;
  return cart.getProducts();
})
.then(products => {
  return Order.create({
    userId : req.userId
  })
  .then(order => {
    order.addProducts(
      products.map(product =>{
        product.orderItem = {quantity : product.cartItem.quantity};
        return product;
      })
    )
  })
  .catch(err =>{
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
})
.then(result => {
  res.status(200).json({msg: 'Ordered',result : result})
})
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
});
};

exports.getOrders = (req, res, next) => {
 User.findByPk(req.userId)
 .then(userData => {
   userData.getOrders({include: ['products']})
   .then(orders => {
     res.status(200).json(orders)
   })
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
});  
 })
.catch(err =>{
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
});
};

