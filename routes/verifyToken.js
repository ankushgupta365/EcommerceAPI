const jwt = require("jsonwebtoken");
const router = require("express").Router();

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,process.env.JWT_EXPIRE,(err,payload)=>{
            if(err){
                res.status(401).json("Token is invalid");
            }else{
                req.user = payload;
                next();
            }
        });
    }else{
        res.status(401).json("You are not authenticated");
    }
}
const verifyTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.userId || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not allowed to that");
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.use.isAdmin){
            next();
        }
    })
}
module.exports = {verifyTokenAndAuthorization,verifyTokenAndAdmin}