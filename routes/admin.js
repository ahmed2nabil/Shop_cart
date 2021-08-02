const express = require('express');

const Product = require('../models/product');

const adminController = require('../controllers/admin');

const { verfiyToken } = require('../middlewares/verfiyToken');
const { productValidator} = require('../middlewares/validator');
const { body } = require('express-validator/check');

const router = express.Router();

// /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',productValidator, verfiyToken,adminController.postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

router.put('/edit-product',productValidator,verfiyToken, adminController.putEditProduct);

router.delete('/delete-product',verfiyToken, adminController.deleteProduct);

module.exports = router;
