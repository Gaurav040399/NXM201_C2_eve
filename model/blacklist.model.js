const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
    token : {type:String, require:true}
})


const BlacklistModel = mongoose.model("blacklist", blacklistSchema);


module.exports = {
    BlacklistModel
}