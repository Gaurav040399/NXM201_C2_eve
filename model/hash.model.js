
const mongoose = require("mongoose");


const hashSchema = mongoose.Schema({
    id : {type:String,  require:true,unique:true},
    password : {type:String,  require:true},
})


const HashModel = mongoose.mongoose.model("hash",hashSchema)


module.exports = {
    HashModel 
}