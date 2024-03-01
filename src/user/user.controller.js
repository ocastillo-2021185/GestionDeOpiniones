import User from './user.model.js'
import { encrypt, comparePassword, checkUpdate, checkUpdateClient } from '../../utils/validator.js'
import { generateJwt } from '../../utils/jwt.js'
import jwt from 'jsonwebtoken'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const defaultAdmin = async () => {
    try {
        const existingUser = await User.findOne({ username: 'default' });
        if (existingUser) {
            return;
        }
        let data = {
            name: 'Default',
            username: 'default',
            password: await encrypt('hola'),
        }
        let user = new User(data)
        await user.save()
    } catch (error) {
        console.error(error)
    }
}

export const signUp = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Some user already have the same name' });
        }
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Umm something was wrong', err: err })
    }
}

export const login = async (req, res) => {
    try {
        let { user, password } = req.body
        let users = await User.findOne({
            $or: [
                { username: user },
                { email: user }
            ]
        });
        if (users && await comparePassword(password, users.password)) {
            let loggedUser = {
                uid: users.id,
                username: users.username,
                email: users.email,
                name: users.name,
            }
            let token = await generateJwt(loggedUser)
            return res.send({ message: `Ohh, hi  ${loggedUser.name}`, loggedUser, token })
        }
        return res.status(404).send({ message: 'The password or the username are wrong' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body;
        let { id } = req.params
        let {token} = req.headers
        let {uid} = jwt.verify(token, process.env.SECRET_KEY)
        let updated = checkUpdateClient(data, id)
        if(id !== uid) return  res.status(401).send({ message: 'Why are you trying to update other account?' })
        if (!updated) return res.status(400).send({ message: 'You are trying to updata stuff that you should not' })
        let updatedUsers = await User.findOneAndUpdate(
            { _id: id },data,{ new: true }
        )
        if (!updatedUsers) return res.status(401).send({ message: 'Umm I guess that the user was not found' })
        return res.send({ message: 'User updated', updatedUsers })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Umm something was wrong', error: error });
    }
}

export const updatePassw = async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body;
        let { id } = req.params;
        let { token } = req.headers;
        let { uid } = jwt.verify(token, process.env.SECRET_KEY);
        if (id !== uid) 
            return res.status(401).send({ message: 'Why are you trying to update other account?' });
        if (!newPassword) 
            return res.status(400).send({ message: 'I guess you missed the password' });
        let user = await User.findOne({ _id: id });
        if (!user) 
            return res.status(404).send({ message: 'The user was not found' });
        if (!(await comparePassword(oldPassword, user.password))) 
            return res.status(401).send({ message: 'Umm, the old password is incorrect' });
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { password: await encrypt(newPassword) },
            { new: true }
        );
        if (!updatedUser) 
            return res.status(404).send({ message: 'Maybe the user was not found' });
        return res.send({ message: 'The password was updated, yaaay', updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Umm smething was wrong', error: error });
    }
};