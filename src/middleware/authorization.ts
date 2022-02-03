import {Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyAuthorization = (req: Request, res: Response, next: NextFunction) => {
       const authHeader = req.headers.jwt_token
       if(authHeader) {
           jwt.verify(String(authHeader), String(process.env.JWT_SEC), (err, user) => {
            if(err) return res.status(401).send()
            console.log('>>>>> user', user)
                req.body.user = user
                next()
           })
       } else {
           return res.status(403).json({error: 'Invalid header token'})
       }
}

export {
    verifyAuthorization
}