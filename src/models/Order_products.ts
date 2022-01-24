import {
  OrderProductReturnType,
  OrderProductType,
} from '../interfaces/Order_products'
import { pool } from '../db'

export class OrderProducts {
  // define table
  table = 'order_products'

  // create an order product
  async createOrderProduct(
    orderProduct: OrderProductType
  ): Promise<OrderProductReturnType> {
    try {
      const { product_id, order_id, quantity } = orderProduct

      const conn = await pool.connect()

      let result = await conn.query(
        `SELECT * FROM ${this.table} WHERE product_id=${product_id}`
      )
      if (result.rows.length === 0) {
        const sql = `INSERT INTO ${this.table} (product_id, quantity, order_id) VALUES($1, $2, $3) RETURNING *`
        result = await conn.query(sql, [product_id, quantity, order_id])
        conn.release()
        return result.rows[0]
      }
      const sql = `UPDATE ${this.table} SET quantity=${
        result.rows[0].quantity + quantity
      } WHERE product_id=${product_id}`
      result = await conn.query(sql)
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`)
    }
  }

  // update an order product
  async updateOrderProductStatus(
    status: string,
    orderId: number
  ): Promise<OrderProductReturnType> {
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
  // delete an order product
  async deleteOrderProduct(id: number): Promise<OrderProductReturnType> {
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
