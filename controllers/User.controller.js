const createError = require('http-errors');
const User = require('../Models/User.model');
const { userValidate } = require('../helpers/validation');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
const client = require('../helpers/connection_redis');


module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const { error } = userValidate(req.body);

            console.log(`:::error validate::${error}`);
            // if(!email || !password){
            //     throw createError.BadRequest();
            // }

            if (error) {
                throw createError(error.details[0].message)
            }


            const isExists = await User.findOne({
                email
            });
            if (isExists) {
                throw createError.Conflict(`${email} is ready been registered`)
            }

            //create khong ho tro middware
            // const isCreate = await User.create({
            //     username:email,
            //     password
            // })

            const user = new User({
                email,
                password
            })

            const savedUser = await user.save();
            console.log("savedUser:", savedUser);

            return res.json({
                status: 'ok',
                // elements:isCreate
                elements: savedUser
            })

        } catch (error) {
            console.log("error:", error);
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {

            const { email, password } = req.body;
            const { error } = userValidate(req.body);
            if (error) {
                throw createError(error.details[0].message)
            }

            const user = await User.findOne({ email });
            if (!user) {
                throw createError.NotFound('User not registered');
            }
            console.log("user:",user);
            const isValid = await user.isCheckPassword(password);
            console.log("isValid:", isValid);
            if (!isValid) {
                throw createError.Unauthorized();
            }
            // đăng nhập thì trả về 2 giá trị này 
            const accessToken = await signAccessToken(user._id);

            const refreshToken = await signRefreshToken(user._id);



            res.json({ accessToken, refreshToken });



        } catch (error) {
            next(error)
        }

        // res.send('function login');
    },
    refreshToken: async (req, res, next) => {
        try {
            console.log(req.body);
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw createError.BadRequest();
            }
            const { userId } = await verifyRefreshToken(refreshToken);
            const accessToken = await signAccessToken(userId);
            // hien tai no dang dk lai refresh token voi code nay moi khi refresh
            // hơi thừa khi phải cấp lại refresh token mới .. 

            const refToken = await signRefreshToken(userId);

            res.json({
                accessToken,
                refreshToken: refToken,
            });

        } catch (error) {
            next(error)
        }

    },
    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                throw createError.BadRequest();
            }
            const { userId } = await verifyRefreshToken(refreshToken);
            client.del(userId.toString(), (err, reply) => {
                if (err) {
                    throw createError.InternalServerError();
                }
                res.json({
                    message: "Logout!"
                })
            });

        } catch (error) {
            next(error)
        }

    },
    getlist: (req, res, next) => {
        console.log(req.headers);
        const listsUser = [
            {
                email: 'abc@gmail.com'
            },
            {
                email: 'a2132222@gmail.com'
            }
        ]
        res.json({ listsUser });
    }
}