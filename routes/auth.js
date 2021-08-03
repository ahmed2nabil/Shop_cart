
const express = require('express');


const authControllers = require('../controllers/auth');
const { verfiyToken } = require('../middlewares/verfiyToken');
const {signupValidator,loginValidator} = require('../middlewares/validator');
const router = express.Router();


router.post('/signup',signupValidator,authControllers.postSignup);

router.post('/login',loginValidator,authControllers.postLogin);


module.exports = router;