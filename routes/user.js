const router = require('express').Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const { hashPassword } = require("./hashing");
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const { json } = require('express');

router.put("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        //generating random bytes 
        const salt = await bcrypt.genSalt(10)
        //referencing the password from the above schema and hashing it using bcrypt library
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: req.body,
        },
            { new: true });

        res.status(201).json(updatedUser);
    } catch (error) {
        res.status(401).json(error)
    }
})

router.delete("/:userId", verifyTokenAndAuthorization,async (req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User deleted sucessfully!")
    } catch (error) {
       res.status(500).json(error); 
    }
})

router.get("/find/:userId",verifyTokenAndAdmin, async (req,res)=>{
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json(error);
    }
})

router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new;
    try {
        
        const users = query? await User.find().sort({_id: -1}).limit(5):await User.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"},

                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                }
            }
        ])

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(err);
    }
})
module.exports = router