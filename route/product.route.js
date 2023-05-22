const express = require("express");
const productRoute = express.Router();
const {ProductModel} = require("../model/product.model")
const {auth1,auth2} = require("../middleware/authenticateUser")
const {authenticateUser1,authenticateUser2} = require("../middleware/auth")

productRoute.get("/products",(authenticateUser1 || authenticateUser2),(auth1 || auth2(["user","seller"])),async(req,res)=>{
    try {
        const product = await ProductModel.find();
        res.status(200).send({msg:"all prodects", Prodect: product})
    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})
productRoute.get("/products",(authenticateUser1 || authenticateUser2),async(req,res)=>{
    try {
        const product = await ProductModel.find();
        res.status(200).send({msg:"all prodects", Prodect: product})
    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})


productRoute.post("/addproducts",(authenticateUser1 || authenticateUser2),(auth1 || auth2(["seller"])),async(req,res)=>{
    try {
        const {title ,desc} = req.body

        const product = new ProductModel({...req.body})
        await product.save();
        res.status(200).send({msg:"Product has been added"});
    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})


productRoute.delete("/deleteproducts/:id",(authenticateUser1 || authenticateUser2),(auth1 || auth2(["seller"])),async(req,res)=>{
    try {
        const {id} = req.params
        const product = await ProductModel.findByIdAndDelete({_id:id});

        res.status(200).send({msg:"Product has been deleted"})
        
    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})


module.exports = {
    productRoute
}