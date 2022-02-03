import { response, Router } from "express"
import getErrorMessage from "../helper/getErrorMessage"
import { verifyAuthorization } from "../middleware/authorization"
import Departments from "../models/Departments"
import User from "../models/User"

const departmentRoute = Router()

departmentRoute.post('/', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const department = new Departments(req.body)
            const response = await department.save()
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send({message: getErrorMessage(error)})
        }
    } else {
        res.status(403).json({message: 'insufficient permission !'})
    }
})

departmentRoute.get('/', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const response = await Departments.find()
            res.status(200).json(response)
        } catch (error) {
            res.status(500).send(response)
        }
    } else {
        res.status(403).json({message: 'insufficient permission !'})
    }   
})

departmentRoute.get('/:department_id', verifyAuthorization, async (req, res) => {
    try {
        const response = await Departments.findById(req.params.department_id)
        if(response) return res.status(200).send(response)
        res.status(404).json({})
    } catch (error) {
        res.status(500).send()
    }
})

departmentRoute.delete('/:department_id', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const users = await User.findOne({'department._id': req.params.department_id})
            if(users == null) {
                const response = await Departments.findByIdAndDelete(req.params.department_id)
                if(response) return res.status(200).send(response)
                res.status(404).json({})
            } else {
                res.status(403).json({message: 'Not allowed ! first update or remove users assigned with this department'})
            }
        } catch (error) {
            res.status(500).send()
        }
    } else {
        res.status(403).json({message: 'insufficient permission !'})
    }   
})

departmentRoute.put('/:department_id', verifyAuthorization, async (req, res) => {
    if(req.body.user.role == 'ADMIN') {
        try {
            const department = await Departments.findById(req.params.department_id)
            if(department) {
                const response_department = await Departments.findByIdAndUpdate(
                    req.params.department_id, 
                    req.body,
                    {new: true}
                )
                const response_user = await User.updateMany({'department._id' : req.params.department_id}, {'department.name': req.body.name } )
                res.status(200).json({response_department, response_user})
            } else {
                res.status(404).json({'message': 'department not found !'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    } else if(req.body.user.role == 'DEPARTMENT_MANAGER') {
        try {
            const department = await Departments.findById(req.params.department_id)
            if(department) {
                const response_department = await Departments.findOneAndUpdate({
                    department_id: req.body.user.department_id
                },
                    req.body,
                    {new: true}
                )
                const response_user = await User.updateMany({'department._id' : req.params.department_id}, {'department.name': req.body.name } )
                res.status(200).json({response_department, response_user})
            } else {
                res.status(404).json({'message': 'department not found !'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    }
 })

export = departmentRoute