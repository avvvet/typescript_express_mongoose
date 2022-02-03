import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    permissions : {
        type: Array,
        required: true
    }
}, {timestamps: true})

export = mongoose.model('Roles', roleSchema)