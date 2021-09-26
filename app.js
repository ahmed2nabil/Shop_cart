'use strict'

const path = require('path');

const express = require('express');
const helmet    = require("helmet");
const compression = require("compression");
const cors      = require("cors");
require('express-async-errors');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

const PORT = process.env.PORT || 3000;
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');




app.use(express.json());
app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use(helmet());
app.use(compression());
app.use(cors());

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

Product.belongsTo(User,{constraints:true,onDelete : 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {through:OrderItem});
Product.belongsToMany(Order, {through:OrderItem});


app.listen(PORT,() => {
    console.log("Server Start running");
});
