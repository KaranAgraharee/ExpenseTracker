import Joi from "joi"
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

export const signupValidation = (req, res, next) =>{
const schema = Joi.object ({
        name: Joi.string().min(1).max(24).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(37).required(),
    })
 const {error} = schema.validate(req.body)
 if(error){
    return res.status(400)
              .json({
                message: "bad request",
                error: error.details[0].message
            })
 }
 next()
}
export const loginValidation = (req, res, next) =>{
    const schema = Joi.object ({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(37).required(),
    })
 const {error} = schema.validate(req.body)
 if(error){
    return res.status(400)
              .json({
                message: "bad request",
                error:error.details[0].message
            })
 }
 next()
}
