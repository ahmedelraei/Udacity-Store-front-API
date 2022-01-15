import { OrderReturnType, OrderType } from '../interfaces/Order'
import { pool } from '../db'

export class Order {
  // define table
  table = 'orders'

  // select all orders for a user
  async getOrders(userId: number): Promise<OrderReturnType[]> {
    try {
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} WHERE user_id=$1`
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
      const sql = `SELECT * FROM ${this.table} WHERE user_id = ${userId} ORDER BY id DESC LIMIT 1`
      const result = await conn.query(sql)
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get current order. Error: ${err}`)
    }
  }

  // Get active order by user id
  async getActiveOrdersByUserId(userId: number): Promise<OrderReturnType[]> {
    try {
      const status = 'active'
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} WHERE user_id = ${userId} AND status = $1`
      const result = await conn.query(sql, [status])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get active order. Error: ${err}`)
    }
  }

  // select completed order by user id
  async getCompletedOrdersByUserId(userId: number): Promise<OrderReturnType[]> {
    try {
      const status = 'complete'
      const conn = await pool.connect()
      const sql = `SELECT * FROM ${this.table} WHERE user_id = ${userId} AND status = $1`
      const result = await conn.query(sql, [status])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get completed orders. Error: ${err}`)
    }
  }

  // create an order
  async createOrder(order: OrderType): Promise<OrderReturnType> {
    try {
      // eslint-disable-next-line camelcase
      const { product_id, quantity, user_id, status } = order

      const conn = await pool.connect()
      const sql = `INSERT INTO ${this.table} (product_id, quantity, user_id, status) VALUES($1, $2, $3, $4) RETURNING *`
      const result = await conn.query(sql, [
        // eslint-disable-next-line camelcase
        product_id,
        quantity,
        // eslint-disable-next-line camelcase
        user_id,
        status,
      ])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`)
    }
  }

  // update an order
  async updateOrderStatus(
    status: string,
    orderId: number
  ): Promise<OrderReturnType> {
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

  async deleteOrder(id: number): Promise<OrderReturnType> {
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
