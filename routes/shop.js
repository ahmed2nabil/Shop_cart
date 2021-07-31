const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const { verfiyToken } = require('../middlewares/verfiyToken');
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart',verfiyToken, shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);


module.exports = router;
