import Publi from './publi.model.js'
import User from '../user/user.model.js'
import jwt from 'jsonwebtoken'
import { checkUpdate } from '../../utils/validator.js'

export const add = async (req, res) => {
    try {
        let data = req.body
        let { token } = req.headers
        let { uid } = jwt.verify(token, process.env.SECRET_KEY)
        data.user = uid
        let publi = new Publi(data)
        await publi.save()
        return res.send({ message: 'The publication was published' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Umm something was wrong', err: err })
    }
}

export const deleted = async (req, res) => {
    try {
        let { id } = req.params;
        let { token } = req.headers;
        let { uid } = jwt.verify(token, process.env.SECRET_KEY);
        let publication = await Publi.findOne({ _id: id, user: uid });
        if (!publication)
            return res.status(404).send({ message: 'The publication was not found or maybe you dont have access to delete it' });
        let deletedPublication = await Publi.findOneAndDelete({ _id: id, user: uid });
        if (!deletedPublication)
            return res.status(500).send({ message: 'Umm something was wrong' });
        return res.send({ message: 'The publication was deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Umm something was wrong' });
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { token } = req.headers
        let data = req.body
        let { uid } = jwt.verify(token, process.env.SECRET_KEY)
        let updated = checkUpdate(data, id)
        let publication = await Publi.findOne({ _id: id, user: uid });
        if (!publication) return res.status(404).send({ message: 'The publication was not found or maybe you dont have access to delete it' });
        if (!updated) return res.status(400).send({ message: 'You are trying to updata stuff that you should not' })
        let updatePubli = await Publi.findOneAndUpdate({_id: id}, data, {new: true})
        if (!updatePubli) return res.status(401).send({ message: 'Maybe the publication was not found' })
        return res.send({ message: 'Publication updated', updatePubli })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}