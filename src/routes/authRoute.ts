import { Router } from "express"
import jwt from 'jsonwebtoken'
import getErrorMessage from "../helper/getErrorMessage"
import { comparePassword } from "../middleware/hashPassword"

const authRoute = Router()

authRoute.post('/login', comparePassword, async (req, res) => {
    try {
       const jwtToken = jwt.sign({
           id: req.body.user._id,
           role: req.body.user.role,
           department_id: req.body.user.department._id
       },
       String(process.env.JWT_SEC),
       {expiresIn: '1000 days'})
       res.status(200).json({jwtToken})
    } catch (error) {
        console.log(getErrorMessage(error))
    }
})

export = authRoute