const mongoose = require('mongoose');



mongoose.connect('mongodb://127.0.0.1:27017/authtestapp')
.then(() => console.log('DB Connected'))
.catch(err => console.log(err));


const userSchema = mongoose.Schema({
    username: String,
    email:String,
    password:String,
    age:Number
});

module.exports = mongoose.model("user", userSchema);