/* eslint-disable no-undef */
import { Order } from '../../models/Order'

import { User } from '../../models/User'
import { Product } from '../../models/Product'
import { OrderReturnType } from '../../interfaces/Order'

const order: Order = new Order()

interface OrderUpdateReturnType {
  id: number
  user_id: number
  status: string
}

describe('Order Model', () => {
  it('should have an getCurrentOrderByUserId  method', () => {
    expect(order.getCurrentOrderByUserId).toBeDefined()
  })
  it('should have a getCompletedOrdersByUserId method', () => {
    expect(order.getCompletedOrdersByUserId).toBeDefined()
  })
  it('should have an getActiveOrdersByUserId  method', () => {
    expect(order.getActiveOrdersByUserId).toBeDefined()
  })
  it('should have a getOrders method', () => {
    expect(order.getOrders).toBeDefined()
  })
  it('should have an updateOrderStatus  method', () => {
    expect(order.updateOrderStatus).toBeDefined()
  })
  it('should have a deleteOrder method', () => {
    expect(order.deleteOrder).toBeDefined()
  })
  it('should have a createOrder method', () => {
    expect(order.createOrder).toBeDefined()
  })
  describe('Manipulate Order methods', () => {
    const user = new User()
    const product = new Product()

    beforeAll(async () => {
      await user.createUser({
        firstname: 'Ahmed',
        lastname: 'Hatem',
        password: 'ahmed2003#',
      })
      await product.createProduct({
        name: 'iPhone',
        price: '645',
        category: 'phone',
      })
    })
    afterAll(async () => {
      await user.deleteUser(1)
      await product.deleteProduct(1)
    })

    it('should create order using createOrder method', async () => {
      const result: OrderReturnType = await order.createOrder({
        user_id: 1,
        status: 'active',
        order_products: [
          {
            product_id: 1,
            quantity: 10,
          },
        ],
      })
      expect(result).toEqual({
        id: 1,
        user_id: 1,
        status: 'active',
        quantity: 10,
        product_id: 1,
        order_id: 1,
      })
    })
    it('should return all orders of user using getOrders method', async () => {
      const result: OrderReturnType[] = await order.getOrders(1)
      expect(result).toEqual([
        {
          id: 1,
          user_id: 1,
          status: 'active',
          quantity: 10,
          product_id: 1,
          order_id: 1,
        },
      ])
    })
    it('should return current order of user using getCurrentOrderByUserId method', async () => {
      const result: OrderReturnType = await order.getCurrentOrderByUserId(1)
      expect(result).toEqual({
        id: 1,
        user_id: 1,
        status: 'active',
        quantity: 10,
        product_id: 1,
        order_id: 1,
      })
    })
    it('should return active orders of user using getActiveOrdersByUserId method', async () => {
      const result: OrderReturnType = await order.getActiveOrdersByUserId(1)
      expect(result).toEqual({
        id: 1,
        user_id: 1,
        status: 'active',
        quantity: 10,
        product_id: 1,
        order_id: 1,
      })
    })
    it('should return completed orders of user using getCompletedOrdersByUserId method', async () => {
      const result: OrderReturnType[] = await order.getCompletedOrdersByUserId(
        1
      )
      expect(result).toEqual([])
    })
    it('should update order status using updateOrderStatus method', async () => {
      const result: OrderUpdateReturnType = await order.updateOrderStatus(
        'complete',
        1
      )
      expect(result).toEqual({
        id: 1,
        user_id: 1,
        status: 'complete',
      })
    })
    it('should delete the correct order', async () => {
      const result: OrderReturnType = await order.deleteOrder(1)
      expect(result).toEqual({
        id: 1,
        user_id: 1,
        status: 'active',
        quantity: 10,
        product_id: 1,
        order_id: 1,
      })
    })
  })
})
