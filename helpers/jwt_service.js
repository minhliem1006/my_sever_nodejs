const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('./connection_redis');

const signAccessToken = async(userId) => {
    return new Promise((resolve,reject)=>{
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const option = {
            expiresIn:'30s'// 10m 10s
        }
        JWT.sign(payload,secret,option, (err,token)=>{
            if(err){
                reject(err);
            }
            resolve(token);
        })
    })
}

// nay middware
const verifyAccessToken = (req,res,next)=>{
    if(!req.headers['authorization']){
        return next(createError.Unauthorized());
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    //start verify token
    JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
        if(err){
            if(err.name==='JsonWebTokenError'){
                return next(createError.Unauthorized());
            }
            return next(createError.Unauthorized(err.message));

        }
        req.payload = payload;
        next();
    })
}


const signRefreshToken = async(userId) => {
    return new Promise((resolve,reject)=>{
        const payload = {
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const option = {
            expiresIn:'1y'// 10m 10s
        }
        JWT.sign(payload,secret,option, (err,token)=>{
            if(err){
                reject(err);
            }
            client.set(userId.toString(),token,'EX',365*24*60*60,(err,reply)=>{
               if(err){
                return reject(createError.InternalServerError());
               } 
               resolve(token);
            });
        })
    })
}
// ham check
const verifyRefreshToken = async(refreshToken) => {
    return new Promise((resolve,reject)=>{
        JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
            if(err){
                return reject(err);
            }
            client.get(payload.userId,(err,reply)=>{
                if(err){
                    reject(createError.InternalServerError());
                }
                if(refreshToken === reply){
                    resolve(payload);
                }
                return reject(createError.Unauthorized());
            })
        })

    })
   
}




module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
}