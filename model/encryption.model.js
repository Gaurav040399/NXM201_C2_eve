const mongoose = require("mongoose");


const encryptedpwds = mongoose.Schema({
    id : {type:String,  require:true,unique:true},
    password : {type:String,  require:true},
})


const EncModel = mongoose.mongoose.model("enc",encryptedpwds)



module.exports = {
    EncModel
}