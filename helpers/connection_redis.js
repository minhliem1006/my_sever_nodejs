const redis = require('redis');
const client = redis.createClient({
    port:6379,
    host:'127.0.0.1'
})

client.ping((err,pong)=>{
    console.log(pong);
    if(err){
        console.log(`Err::${err}`);
    }
});

client.on('error', function(err){ 
    console.info('Redis error!',err);
})

client.on('connect', function(){ 
    console.info('Redis connected!');
})

client.on('ready', function(){ 
    console.info('Redis ready!');
})

module.exports = client;