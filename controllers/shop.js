const dbConnection = require("../database/connection");
const queryList = require("../database/queries").queryList;

const ITEMS_PER_PAGE = 2;



exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  const numProds = await dbConnection.dbQuery(queryList.PRODUCT_COUNT_QUERY);
    totalItems = numProds;
 const products = await dbConnection.dbQuery(queryList.GET_ALL_PROUDCTS_PER_PAGE_QUERY,[ITEMS_PER_PAGE, (page - 1) * ITEMS_PER_PAGE])
    const prods = products.rows.map((products) => {
      return {title: products.title,
        description : products.description,
        imageUrl : products.imageUrl,
        price : products.price
      };
    });
    res.status(200).json(prods);

}

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
 const product = await dbConnection.dbQuery(queryList.GET_PROUDCT_DETAILS_QUERY,[prodId]);
 if(!product.rows.length) {
   return res.status(404).json({msg: "Product not exists"})
 } 
 const prod =  {title: product.rows[0].title,
      description : product.rows[0].description,
      imageUrl : product.rows[0].image_url,
      price : product.rows[0].price
    };
  res.status(200).json(prod);

}


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

