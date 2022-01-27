import { Router, Request, Response } from 'express'
import { User } from '../models/User'
import { UserReturnType, UserCreatedReturnType } from '../interfaces/User'
import { authToken } from '../middlewares/auth'

export const UserController: Router = Router()
const user: User = new User()

// select all users
UserController.get('/', authToken, async (_: Request, res: Response) => {
  try {
    const allUsers: UserReturnType[] = await user.getUsers()
    return res.json(allUsers)
  } catch (err) {
    throw new Error(`Error: ${err}`)
  }
})
// select user by id
UserController.get('/:id', authToken, async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id)
    const allUsers: UserReturnType = await user.getUserById(userId)
    return res.json(allUsers)
  } catch (err) {
    throw new Error(`Error: ${err}`)
  }
})
// create a user
UserController.post('/', async (req: Request, res: Response) => {
  try {
    const newUser: UserCreatedReturnType = await user.createUser(req.body)
    return res.json(newUser)
  } catch (err) {
    throw new Error(`Error: ${err}`)
  }
})
// delete a user by id
UserController.delete(
  '/:id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id)
      const deletedOrder: UserReturnType = await user.deleteUser(id)
      return res.json(deletedOrder)
    } catch (err) {
      throw new Error(`Error: ${err}`)
    }
  }
)
