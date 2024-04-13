const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const passportLocalMongoose = require('passport-Local-Mongoose');

const UserSchema = new Schema({
    email:{
        type: String,    
        required: true,
        unique: true        
    }

});
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',UserSchema);