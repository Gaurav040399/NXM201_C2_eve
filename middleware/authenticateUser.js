const {ProductModel} = require("../model/product.model");
const jwt = require("jsonwebtoken");

const auth1 = async ( req,res,next)=>{
    const userRole = req.role
    const userID = req.userID

    const {id} = req.params;

    if(userRole == "seller"){
        next()
    }else{
        const product = await ProductModel.findById({_id:id});
        if(product.userID == userID){
            next()
        }else{
            return res.status(400).send({msg:"Unauthorize"})
        }
    }
}

const auth2 = async (roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(400).send({msg:"Unauthorize user"})
        }else{
            next()
        }
    }
}


module.exports = {
    auth1,
    auth2
}