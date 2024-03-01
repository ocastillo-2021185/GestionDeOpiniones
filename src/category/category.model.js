import {Schema, model} from 'mongoose'

const categorySchema = Schema({
    name: {
        type: String,
        require: [true, "Name is require"]
    },
    description: {
        type: String,
        required: [true, "description is require"]
    }
},{
    versionKey: false
})

export default model('category', categorySchema)