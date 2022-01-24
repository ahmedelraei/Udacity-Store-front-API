/* eslint-disable no-undef */
import supertest from 'supertest'
import { Order } from '../../models/Order'
import { server } from '../../index'

const request = supertest(server)
const token: string = process.env.TOKEN_TEST as string

describe('Test Order endpoint responses', () => {
  beforeAll(() => {
    spyOn(Order.prototype, 'createOrder').and.returnValue(
      Promise.resolve({
        id: 2,
        user_id: 2,
        status: 'active',
        quantity: 4,
        product_id: 10,
        order_id: 1,
      })
    )
    spyOn(Order.prototype, 'getOrders').and.returnValue(
      Promise.resolve([
        {
          id: 1,
          user_id: 2,
          status: 'complete',
          product_id: 13,
          order_id: 1,
          quantity: 1,
        },
        {
          id: 2,
          user_id: 2,
          status: 'active',
          product_id: 10,
          order_id: 1,
          quantity: 4,
        },
      ])
    )
    spyOn(Order.prototype, 'getCurrentOrderByUserId').and.returnValue(
      Promise.resolve({
        id: 2,
        user_id: 10,
        status: 'active',
        product_id: 1,
        order_id: 1,
        quantity: 4,
      })
    )
    spyOn(Order.prototype, 'getActiveOrdersByUserId').and.returnValue(
      Promise.resolve({
        id: 2,
        user_id: 2,
        status: 'active',
        product_id: 4,
        order_id: 1,
        quantity: 10,
      })
    )
    spyOn(Order.prototype, 'getCompletedOrdersByUserId').and.returnValue(
      Promise.resolve([
        {
          id: 1,
          user_id: 2,
          status: 'complete',
          product_id: 13,
          order_id: 1,
          quantity: 1,
        },
      ])
    )
    spyOn(Order.prototype, 'updateOrderStatus').and.returnValue(
      Promise.resolve({
        id: 1,
        user_id: 1,
        status: 'active',
      })
    )
    spyOn(Order.prototype, 'deleteOrder').and.returnValue(
      Promise.resolve({
        id: 1,
        user_id: 2,
        status: 'complete',
      })
    )
  })

  it('create order api endpoint', async () => {
    const res = await request
      .post('/orders')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: 2,
      user_id: 2,
      status: 'active',
      product_id: 10,
      order_id: 1,
      quantity: 4,
    })
  })
  it('gets all orders api endpoint', async () => {
    const res = await request
      .get('/orders/2')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
      {
        id: 1,
        user_id: 2,
        status: 'complete',
        product_id: 13,
        order_id: 1,
        quantity: 1,
      },
      {
        id: 2,
        user_id: 2,
        status: 'active',
        product_id: 10,
        order_id: 1,
        quantity: 4,
      },
    ])
  })
  it('gets current user order by id api endpoint', async () => {
    const res = await request
      .get('/orders/current/2')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: 2,
      user_id: 10,
      status: 'active',
      product_id: 1,
      order_id: 1,
      quantity: 4,
    })
  })
  it('gets active user order api endpoint', async () => {
    const res = await request
      .get('/orders/active/2')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: 2,
      user_id: 2,
      status: 'active',
      quantity: 10,
      product_id: 4,
      order_id: 1,
    })
  })
  it('gets completed user order api endpoint', async () => {
    const res = await request
      .get('/orders/completed/2')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
      {
        id: 1,
        user_id: 2,
        status: 'complete',
        quantity: 1,
        product_id: 13,
        order_id: 1,
      },
    ])
  })
  it('updates user order api endpoint', async () => {
    const res = await request
      .put('/orders?status=active&orderId=1')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: 1,
      user_id: 1,
      status: 'active',
    })
  })
  it('updates user order with wrong parameters api endpoint', async () => {
    const res = await request
      .put('/orders?status=acti&orderId=1')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(400)
    expect(res.body.Error).toEqual('Bad parameters')
  })
  it('deletes a user order api endpoint', async () => {
    const res = await request
      .delete('/orders/1')
      .set('Authorization', 'Bearer ' + token)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: 1,
      user_id: 2,
      status: 'complete',
    })
  })
})
