import mongoose from 'mongoose'
import validator from 'validator'

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: (value: any) => {
            if(validator.isEmpty(value)) throw new Error('Pleae enter department name!')
        }
    },
    description: {
        type: String,
        required: false
    }
}, {timestamps: true})

export = mongoose.model('Departments', departmentSchema)