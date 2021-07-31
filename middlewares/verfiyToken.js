const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../util/config');

exports.verfiyToken = (req,res,next) => {
var token = req.headers['authorization'].split(' ')[1];

if(!token) 
return res.status(403).json({msg: "No token provided"});
jwt.verify(token,config.secret,function(err, decoded) {
    if(err) return res.status(500).json({msg: "Failed to authenticated"});

    req.userId = decoded.id;
    next();
})
}
