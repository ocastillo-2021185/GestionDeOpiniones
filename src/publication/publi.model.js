import {Schema, model} from 'mongoose'

const publiSchema = Schema({
    title: {
        type: String,
        require: [true, "Title is require"]
    },
    description: {
        type: String,
        required: [true, "description is require"]
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is require"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        require: [true, "category is require"]
    }
},{
    versionKey: false
})

export default model('publi', publiSchema)