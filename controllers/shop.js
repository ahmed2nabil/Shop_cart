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


exports.getCart = async(req, res, next) => {

const cart = await dbConnection.dbQuery(queryList.GET_CART_QUERY,[req.userId]);

const products = await dbConnection.dbQuery(queryList.GET_PRODUCTS_FROM_USER_CART_QUERY,[cart.rows[0].cart_id])

          res.status(200).json({products : products.rows});
 
}

exports.postCart = async (req, res, next) => {
  /**
   * find the cart related to the user
   * find the products item in the cart
   * add the product to the cart and increase the qunantity if exists 
   * 
   */
const prodId  = req.body.productId
  let fetchedCart;
let newQuantity = 1;
let product ;
const cart = await dbConnection.dbQuery(queryList.GET_CART_QUERY,[req.userId]);

const products = await dbConnection.dbQuery(queryList.GET_PRODUCTS_FROM_CART_QUERY,[prodId])
  if(products.rows.length > 0){
    product = products.rows[0];
  }
  if(product) {
    const oldQuantity = product.quantity;
    newQuantity += oldQuantity;
 const data = await dbConnection.dbQuery(queryList.UPDATE_CARTITEMS_QUERY,[newQuantity, cart.rows[0].cart_id, prodId])

  } else {
   product =  await dbConnection.dbQuery(queryList.GET_PROUDCT_DETAILS_QUERY,[prodId]);
 const data = await dbConnection.dbQuery(queryList.INSERT_INTO_CARTITEMS_QUERY,[newQuantity,cart.rows[0].cart_id,prodId])
  }
  res.status(200).json({msg : "added to the Cart"});

}

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
const cart = await dbConnection.dbQuery(queryList.GET_CART_QUERY,[req.userId]);

const products = await dbConnection.dbQuery(queryList.DELETE_PRODUCT_FROM_CARTITEM_QUERY,[prodId, cart.rows[0].cart_id])

      res.status(200).json({msg: "DELETED SUCCESSFULLY"});
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

