import { Request, Response, NextFunction } from 'express'
import bycrypt from 'bcrypt'
import User from '../models/User'
import validator from 'validator'
import { isUndefined } from 'lodash'

const encryptPassword = (req : Request, res: Response, next: NextFunction) => {
    if(isUndefined(req.body.password)) return res.status(400).json({message: 'password required!'})
    if(validator.isEmpty(req.body.password)) return res.status(400).json({message: 'please enter password'})
    if(!validator.isLength(req.body.password, {min: 6, max: 1000})) return res.status(400).json({message: 'Length of the password should be between 6-1000'})
    try {
        bycrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
               console.log(err) 
               return
            }
    
            req.body.password = hash
            next()
        })
    } catch (error) {
        res.status(500).json({message: 'unknown error'})
    }
}

const comparePassword = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({username: req.body.username}) 
        if(user) {
            bycrypt.compare(req.body.password, user.password, (err, hash) => {
                if(hash) {
                   req.body.user = user // to be used for jwt sign
                   return next()
                } else {
                  return res.status(401).send()
                }
            })
        } else {
            return res.status(403).send()
        }
    } catch (error) {
        return res.status(500).send()
    } 
}

export {
    encryptPassword, 
    comparePassword
}