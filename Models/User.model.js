const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
    testConnection,
    userConnection
} = require('../helpers/connections_multi_mongdb');
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,

    }
});
// const UserSchema01 = new schema({
//     username: {
//         type: String,
//         lowercase: true,
//         unique: true,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,

//     }
// });

// module.exports  = {
//     test:testConnection.model('user',UserSchema),
//     user:userConnection.model('user',UserSchema),
// }


//xu li du lieu truoc khi vao data base

UserSchema.pre('save', async function(next){
    try {
        console.log(`Called before save":::`,this.email, this.password);

        const salt = await bcrypt.genSalt(10);
        const hashPassword =  await bcrypt.hash(this.password,salt);
        this.password = hashPassword;
        next();

    } catch (error) {
        next(error);
    }
});


UserSchema.methods.isCheckPassword = async function(password){
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error) {
        
    }
}


module.exports  = userConnection.model('users',UserSchema);
// module.exports  = mongoose.model('user',UseSchema);