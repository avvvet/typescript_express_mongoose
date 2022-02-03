import mongoose from 'mongoose'
import validator from 'validator'

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: false
    },
    department: {
          _id: {
            type: String,
            required: true,
            index: true,
            validate: (value: any) => {
               if(!validator.isMongoId(value)) throw new Error('Please enter valid id!')
            }
          },
          name: {
              type: String,
              required: true
          }
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'DEPARTMENT_MANAGER', 'EMPLOYEE', 'GUEST']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: (value: any) => {
            if(!validator.isEmail(value)) throw new Error('Pleae enter valid E-mail!')
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        validate: (value: any) => {
            if(!validator.isLength(value, { min: 6, max: 1000 })) throw new Error('Length of the password should be between 6-1000')
        }
    }
}, { timestamps: true })

UserSchema.index({role: 1, email: 1, 'department.name': 1}, {name: 'role_email_department_name'})
const User = mongoose.model('User', UserSchema)

User.createIndexes()

export =  User