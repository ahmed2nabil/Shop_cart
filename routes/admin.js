const express = require('express');

const Product = require('../models/product');

const adminController = require('../controllers/admin');

const { verfiyToken } = require('../middlewares/verfiyToken');
const { productValidator} = require('../middlewares/validator');
const { body } = require('express-validator/check');

const router = express.Router();


router.get('/products', adminController.getProducts);


router.post('/add-product', verfiyToken, adminController.postAddProduct);


router.put('/edit-product',verfiyToken, adminController.putEditProduct);

router.delete('/delete-product',verfiyToken, adminController.deleteProduct);

module.exports = router;
