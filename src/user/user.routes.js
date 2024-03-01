import {Router} from 'express'
import { update, updatePassw, login, signUp } from './user.controller.js'
import { validateJwt } from '../middleware/validate.js'

const api = Router()

api.post('/add', signUp)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.put('/updatePassw/:id', [validateJwt], updatePassw)

export default api