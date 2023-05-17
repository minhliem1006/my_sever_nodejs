const express = require('express');
const app = express();
const UserRoute = require('./Routes/User.route');
const createError = require('http-errors');
require('dotenv').config();

//connect with redis 
const client = require('./helpers/connection_redis');


// client.set('foo','liemliem');

// client.get('foo',(err,result)=>{
//     if(err){
//         throw createError.BadRequest();
//     }
//     console.log("result:",result);
// });

//

const PORT = process.env.PORT || 3001;
app.get('/',(req,res,next)=>{
    res.send("Home page");
})



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/user',UserRoute);



//middware show error 
app.use((req,res,next)=>{   
    // const error = new Error('Not Found');
    // error.status = 500;

    next(createError.NotFound('This route does not exist.'));
});

app.use((err,req,res,next)=>{
    res.json({
        status:err.status || 500,
        message: err.message
    })
});




app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})