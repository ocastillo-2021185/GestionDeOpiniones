import {Schema, model} from 'mongoose'

const commentSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: [true, "user is require"]
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: "publi",
        require: [true, "Publication is require"]
    },
    comment:{
        type: String,
        required: [true, "comment is require"]
    }
},{
    versionKey: false
})

export default model('comment', commentSchema)