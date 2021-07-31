const express = require('express');
const Product = require('../models/product');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

router.put('/edit-product', adminController.putEditProduct);

router.delete('/delete-product', adminController.DeleteProduct);

module.exports = router;
