'use strict'

const path = require('path');

const express = require('express');
const helmet    = require("helmet");
const compression = require("compression");
const cors      = require("cors");
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('express-async-errors');

const errorMiddelware = require("./middlewares/error")
const NotFoundMiddlware = require("./middlewares/notFound")
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



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
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
app.use(helmet());
app.use(compression());
app.use(cors());

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1',shopRoutes);
app.use('/api/v1',authRoutes);
app.use(errorMiddelware);
app.use(NotFoundMiddlware);
module.exports = app;