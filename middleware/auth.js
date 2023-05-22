const jwt = require("jsonwebtoken");
const {BlacklistModel} = require("../model/blacklist.model");


const authenticateUser1 = async (req,res,next)=>{
    const {accessToken} = req?.cookies

    if(!accessToken){
        return res.status(400).send({msg:"Please login first"});
    }

    const isTokenBlacklisted = await BlacklistModel.findOne({token:accessToken});

    if(isTokenBlacklisted){
        return res.status(400).send({msg:"Please login first"})
    }

    jwt.verify(accessToken,process.env.accessToken,(err,payload)=>{
        if(err){
            return res.status(400).send({msg:err.massege});
        }else{
            req.user = payload.userID
            req.role = payload.role
            next()
        }
    })
}


const authenticateUser2 = async (req, res,next)=>{
    const token = req?.headers?.authorization

    if(!token){
        return res.status(400).send({msg:"token not provided"});
    }

    jwt.verify(token, process.env.accessToken,(err, user)=>{
        if(err){
            return res.status(400).send({msg:"Invalid token"});
        }

        req.user = user
        next()
    })
}

module.exports = {
    authenticateUser1,
    authenticateUser2
}