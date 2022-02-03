import { Router, Request, Response } from "express"
import { isUndefined, pick } from 'lodash'
import User from "../models/User"
import Departments from "../models/Departments"
import { encryptPassword } from '../middleware/hashPassword'
import { verifyAuthorization } from "../middleware/authorization"
import escapeRegex from "../helper/escapeRegex"
import getErrorMessage from "../helper/getErrorMessage"

const userRoute = Router()

userRoute.get('/search', verifyAuthorization, async (req, res) => {
    const perPage : number = Number(req.query.perPage) > 0 ? Number(req.query.perPage) : 5
    const page : number = Number(req.query.page) > 0 ? Number(req.query.page) : 1
    const $regex = isUndefined(req.query.q) ? '' : escapeRegex(String(req.query.q))
    
    if(req.body.user.role == 'ADMIN') {
        try {
            const response = await User.find({
                $or : [{username: { $regex }}, {role: { $regex }}, {email: { $regex }}, {'department.name': { $regex }}]
            }).skip(perPage * page - perPage).limit(perPage).sort({updatedAt: -1})
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    } else if(req.body.user.role == 'DEPARTMENT_MANAGER') {
        try {
            const response = await User.find({
                $or : [{username: { $regex }}, {role: { $regex }}, {email: { $regex }}, {'department.name': { $regex }}], 
                'department._id': req.body.user.department_id
            }).skip(perPage * page - perPage).limit(perPage).sort({updatedAt: -1})
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    }
})

userRoute.get('/:user_id', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const response = await User.findById(req.params.user_id)
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
        }
    } else if(req.body.user.role == 'DEPARTMENT_MANAGER') {
        try {
            const response = await User.findOne({_id: req.params.user_id, 'department._id': req.body.user.department_id})
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    }
})

userRoute.get('/', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const response = await User.find()
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
        }
    } else if(req.body.user.role == 'DEPARTMENT_MANAGER') {
        try {
            const response = await User.find({'department._id': req.body.user.department_id})
            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    }
})

userRoute.post('/', [verifyAuthorization, encryptPassword] , async (req: Request, res: Response) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const department = await Departments.findById(req.body.department_id)
            if(department) {
                req.body.department = pick(department, ['_id', 'name'])
                const user = new User(req.body)
                const response = await user.save()
                res.status(200).send(response)
            } else {
                res.status(404).json({message: 'department not found, could not be saved !'})
            }
        } catch (error) {
              res.status(500).send({message: getErrorMessage(error)});
        }
    } else {
        res.status(403).json({message: 'insufficient permission !'})
    }
})  

userRoute.delete('/:user_id', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const response = await User.findByIdAndDelete(req.params.user_id)
            if(response) return res.status(200).send(response)
            res.status(404).json({})
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    } else {
        res.status(403).json({message: 'insufficient permission !'})
    }   
})

/**
 * Super admin can assign a user to a department
 */
userRoute.put('/:user_id/departments/:department_id', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const department = await Departments.findById(req.params.department_id)
            const user = await User.findById(req.params.user_id)
            if(department && user) {
                const response = await User.findByIdAndUpdate(
                    req.params.user_id, 
                    {department: pick(department, ['_id', 'name'])},
                    {new: true}
                )
                res.status(200).send(response)
            } else {
              res.status(404).send({message: 'user or department id is not valid !'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    } else {
        res.status(403).json({message: 'insufficient permission !'})
    }   
})

export = userRoute