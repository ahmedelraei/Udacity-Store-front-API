import { OrderReturnType, OrderType } from '../interfaces/Order'
import { pool } from '../db'
import { OrderProducts } from './Order_products'

interface OrderUpdateReturnType {
  id: number
  user_id: number
  status: string
}
export class Order {
  // define table
  table = 'orders'

  // select all orders for a user
  async getOrders(userId: number): Promise<OrderReturnType[]> {
    try {
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} INNER JOIN order_products ON orders.id=order_products.order_id WHERE user_id=$1`
      const result = await conn.query(sql, [userId])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get all orders of user. Error: ${err}`)
    }
  }

  // Get current order by user id
  async getCurrentOrderByUserId(userId: number): Promise<OrderReturnType> {
    try {
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} INNER JOIN order_products ON orders.id=order_products.order_id WHERE user_id = ${userId}`
      const result = await conn.query(sql)
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get current order. Error: ${err}`)
    }
  }

  // Get active order by user id
  async getActiveOrdersByUserId(userId: number): Promise<OrderReturnType> {
    try {
      const status = 'active'
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} INNER JOIN order_products ON orders.id=order_products.order_id WHERE user_id = ${userId} AND status=$1`
      const result = await conn.query(sql, [status])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get active order. Error: ${err}`)
    }
  }

  // select completed order by user id
  async getCompletedOrdersByUserId(userId: number): Promise<OrderReturnType[]> {
    try {
      const status = 'complete'
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} INNER JOIN order_products ON orders.id=order_products.order_id WHERE user_id=$1 AND status=$2`
      const result = await conn.query(sql, [userId, status])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get completed orders. Error: ${err}`)
    }
  }

  // create an order
  async createOrder(order: OrderType): Promise<OrderReturnType> {
    try {
      const { user_id, order_products } = order
      const conn = await pool.connect()
      let result = await conn.query(
        `SELECT * FROM ${this.table} WHERE user_id=${user_id}`
      )
      if (result.rows.length === 0) {
        const sql = `INSERT INTO ${this.table} (user_id, status) VALUES($1, $2) RETURNING *`
        result = await conn.query(sql, [user_id, 'active'])

        conn.release()
      }

      const orderProducts = new OrderProducts()
      console.log(result)
      await orderProducts.createOrderProduct({
        product_id: order_products[0].product_id,
        order_id: result.rows[0].id,
        quantity: order_products[0].quantity,
      })
      console.log(result.rows[0])
      return this.getActiveOrdersByUserId(user_id)
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`)
    }
  }

  // update an order
  async updateOrderStatus(
    status: string,
    orderId: number
  ): Promise<OrderUpdateReturnType> {
    try {
      const conn = await pool.connect()
      const sql = `UPDATE ${this.table} SET status=$1 WHERE id=$2 RETURNING *`
      const result = await conn.query(sql, [status, orderId])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not update order status. Error: ${err}`)
    }
  }

  // delete an order
  async deleteOrder(id: number): Promise<OrderUpdateReturnType> {
    try {
      const sql = `DELETE FROM ${this.table} WHERE id=$1 RETURNING *`
      const conn = await pool.connect()
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`)
    }
  }
}
