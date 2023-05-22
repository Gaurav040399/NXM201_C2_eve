const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    title : {type:String,  require:true},
    desc :  {type:String,  require:true},
    userID :  {type:String,  require:true}

})

const ProductModel = mongoose.model("product",productSchema);

module.exports = {
    ProductModel
}