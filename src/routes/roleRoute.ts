import { Router } from "express"
import Role from "../models/Roles"

const roleRoute = Router()

roleRoute.post('/', async (req, res) => {
    const role = new Role(req.body)
    try {
        const response = await role.save()
        res.status(200).send(response)
    } catch (error) {
        console.log('>> >>> ', error)
    }
})

export = roleRoute