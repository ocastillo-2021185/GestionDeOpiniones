import {Router} from 'express'
import { add, deleted, update } from './publi.controller.js'
import { validateJwt } from '../middleware/validate.js'

const api = Router()

api.post('/add', [validateJwt], add)
api.delete('/delete/:id', [validateJwt], deleted)
api.put('/update/:id', [validateJwt], update)

export default api