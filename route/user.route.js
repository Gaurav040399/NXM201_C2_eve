const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel} = require("../model/user.model")
const {HashModel} = require("../model/hash.model")
const {EncModel} = require("../model/blacklist.model")
const {BlacklistModel} = require("../model/blacklist.model")


userRoute.post("/signup",async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;

        const isUserPresent = await UserModel.findOne({email});

        if(isUserPresent){
            return res.status(400).send({msg:"User already present,Please login"})
        }

        const hashPass = await bcrypt.hash(password,4);

        const user = new UserModel({...req.body, password:hashPass});
        await user.save();

        res.status(200).send({msg:"Signup seccessfull", user: user});

    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})


userRoute.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const isUserPresent = await UserModel.findOne({email});
        if(!isUserPresent){
            return res.status(400).send({msg:"User Not Found, Please, Signup First"})
        }

        const isPassCorrect = await bcrypt.compare(password, isUserPresent.password)

        if(!isPassCorrect){
            return res.status(400).send({msg:"Invalid Credential"})
        }

        const accessToken = jwt.sign({userID:isUserPresent._id,role:isUserPresent.role},process.env.accessToken,{expiresIn:process.env.accessTokenEx})

        const refreshToken = jwt.sign({userID:isUserPresent._id,role:isUserPresent.role},process.env.refreshToken,{expiresIn:process.env.refreshTokenEx})

        res.cookie("accessToken",accessToken,{maxAge:1000*60*60*3})
        res.cookie("refreshToken",refreshToken,{maxAge:1000*60*60*7})

        res.status(200).send({msg:"Login seccessfull", accessToken: accessToken, refreshToken: refreshToken});

    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})


userRoute.get("/logout",async(req,res)=>{
    try {
        const {accessToken, refreshToken} = req?.cookies
        if(!accessToken || !refreshToken){
            return res.status(400).send({msg:"Unauthorize"});
        }

        const blacklistAccessToken = new BlacklistModel({token:accessToken});
        const blacklistRefreshToken = new BlacklistModel({token:refreshToken});

        await blacklistAccessToken.save();
        await blacklistRefreshToken.save();

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).send({msg:"Logout Seccessfull"})

    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})


userRoute.get("/refresh_token",async(req,res)=>{
    const refresh_token = req?.cookies.refreshToken
    const isTokenBlacklisted = await BlacklistModel.findOne({token:refresh_token});

    if(isTokenBlacklisted){
        return res.status(400).send({mag:"Please login"})
    }
    const isTokenValid = jwt.verify(refresh_token,process.env.refreshToken)

    if(!isTokenValid){
        return res.status(400).send({mag:"Please login"})
    }

    const newAccessToken = jwt.sign({userID:isUserPresent._id,role:isUserPresent.role},process.env.refreshToken,{expiresIn:process.env.refreshTokenEx})

    res.cookie("accessToken",newAccessToken);
    res.status(200).send({msg:"Token Refresh", accessToken : newAccessToken})
})

// Quesion Hashing and Verifying

userRoute.post("/hashmypwd",async(req,res)=>{
    const {id, password} = req.body
    const hashPass = await bcrypt.hash(password,4);
    const hashpassword = new HashModel({...req.body, password:hashPass});
        await hashpassword.save();
        res.status(200).send({msg:"Hash of the Password stored successfully."});
})


userRoute.post("/verifymypwd",async(req,res)=>{
    const {id,password} = req.body;
    const isIdPresent = await HashModel.findOne(id);
    const isPassCorrect = await bcrypt.compare(password, isIdPresent.password)

    if(!isPassCorrect){
        return res.status(400).send({msg:"Password doesn't match", Response: "false"})
    }
    res.status(200).send({msg:"Password match", Response: "true"})

})




// Encryption and Decryption Question

userRoute.post("/encryptmypwd",async(req,res)=>{
    const {id, password} = req.body
    const encryptPass = await bcrypt.hash(password,4);
    const encpassword = new EncModel({...req.body, password:encryptPass});
        await encpassword.save();
        res.status(200).send({Response:"Password stored successfully in encrypted form"});
})

userRoute.get("/getmypwd/:id", async(req,res)=>{

    const {id} = req.params

    const isIdPresent = await EncModel.findOne(id);
    const isPassCorrect = bcrypt.compare(req.password, isIdPresent.password)
    if(!isPassCorrect){
        return res.status(400).send({msg:"Password doesn't match", status: false})
    }

    res.status(200).send({msg:"My password", Response : req.password})
})


userRoute.post("/verifymypwd",async(req,res)=>{
    const {id,password} = req.body;
    const isIdPresent = await EncModel.findOne(id);
    const isPassCorrect = await bcrypt.compare(password, isIdPresent.password)

    if(!isPassCorrect){
        return res.status(400).send({msg:"Password doesn't match", status: false})
    }
    res.status(200).send({msg:"Password match", status: true})

})

module.exports = {
    userRoute
}