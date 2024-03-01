import Comment from './comment.model.js'
import User from '../user/user.model.js'
import Publi from '../publication/publi.model.js'
import jwt from 'jsonwebtoken'
import { checkUpdate } from '../../utils/validator.js'

export const add = async (req, res) => {
    try {
        let data = req.body
        let {token} = req.headers
        let {uid} = jwt.verify(token, process.env.SECRET_KEY)
        //let uid = req.user._id
        data.user = uid
        if(!data.publication || !data.comment || !data.user) return res.status(400).send({message: 'You must send all the parameters'})
        let comment = new Comment(data)
        await comment.save()
        return res.send({ message: 'add comment successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error add comment', err: err })
    }
}

export const update = async (req, res) => {
    try {
        let {id} = req.params
        //let uid = req.user._id
        let {token} = req.headers
        let data = req.body
        let {uid} = jwt.verify(token, process.env.SECRET_KEY)
        let updated = checkUpdate(data, id)
        let comment = await Comment.findOne({ _id: id, user: uid });
        if (!comment) return res.status(404).send({ message: 'The comment was not found or maybe you dont have access to delete it' });
        if (!updated) return res.status(400).send({ message: 'You are trying to updata stuff that you should not' })
        let updateComment = await Comment.findOneAndUpdate({_id: id}, data, {new: true})
        if (!updateComment) return res.status(401).send({ message: 'Maybe the comment was not found' })
        return res.send({ message: 'Comment updated', updateComment })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating comment' })
    }
}

export const deleted = async (req, res) => {
    try {
        let {id} = req.params;
        let {token} = req.headers;
        let {uid} = jwt.verify(token, process.env.SECRET_KEY);
        let comment = await Comment.findOne({ _id: id, user: uid });
        if (!comment)
            return res.status(404).send({ message: 'The comment was not found or maybe you dont have access to delete it' });
        let updatedComment = await Comment.findOneAndDelete({ _id: id, user: uid });
        if (!updatedComment)
            return res.status(500).send({ message: 'Error deleting comment' });
        return res.send({ message: 'The comment was deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting comment' });
    }
}