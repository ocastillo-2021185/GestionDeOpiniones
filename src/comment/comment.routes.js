import {Router} from 'express'
import { add, deleted, update } from './comment.controller.js'
import { validateJwt } from '../middleware/validate.js'


const api = Router()
api.post('/add', [validateJwt], add)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleted)

export default api