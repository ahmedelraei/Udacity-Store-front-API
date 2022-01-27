import { Router, Response, Request } from 'express'

import { Order } from '../models/Order'
import { OrderReturnType, OrderType } from '../interfaces/Order'
import { authToken } from '../middlewares/auth'

export const OrderController: Router = Router()
const order: Order = new Order()

interface OrderUpdateReturnType {
  id: number
  user_id: number
  status: string
}

// Get all orders by user id
OrderController.get(
  '/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id)
      const currentOrder: OrderReturnType[] = await order.getOrders(userId)
      return res.json(currentOrder)
    } catch (err) {
      throw new Error(`Error: ${err}`)
    }
  }
)
// Get current order by user id
OrderController.get(
  '/current/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id)
      const currentOrder: OrderReturnType = await order.getCurrentOrderByUserId(
        userId
      )
      return res.json(currentOrder)
    } catch (err) {
      throw new Error(`Error: ${err}`)
    }
  }
)
// Get active order by user id
OrderController.get(
  '/active/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id)
      const activeOrder: OrderReturnType = await order.getActiveOrdersByUserId(
        userId
      )
      return res.json(activeOrder)
    } catch (err) {
      throw new Error(`Error: ${err}`)
    }
  }
)
// Get all completed orders by user id
OrderController.get(
  '/completed/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id)
      const currentOrder: OrderReturnType[] =
        await order.getCompletedOrdersByUserId(userId)
      return res.json(currentOrder)
    } catch (err) {
      throw new Error(`Error: ${err}`)
    }
  }
)

// Update order's status.
OrderController.put('/', authToken, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string
    const orderId = parseInt(req.query.orderId as string)

    if (orderId && ['active', 'complete'].includes(status)) {
      const updatedOrder: OrderUpdateReturnType = await order.updateOrderStatus(
        status,
        orderId
      )
      return res.json(updatedOrder)
    } else {
      return res.status(400).json({ Error: 'Bad parameters' })
    }
  } catch (err) {
    throw new Error(`Error: ${err}`)
  }
})
// delete order by order id
OrderController.delete(
  '/:id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id)
      const deletedOrder: OrderUpdateReturnType = await order.deleteOrder(id)
      return res.json(deletedOrder)
    } catch (err) {
      throw new Error(`Error: ${err}`)
    }
  }
)
// create order
OrderController.post('/', authToken, async (req: Request, res: Response) => {
  try {
    const newOrder: OrderReturnType = await order.createOrder(req.body)
    return res.json(newOrder)
  } catch (err) {
    throw new Error(`Error: ${err}`)
  }
})
