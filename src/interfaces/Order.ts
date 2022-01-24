/* eslint-disable camelcase */

import { OrderProductType } from './Order_products'

export interface OrderType {
  user_id: number
  status?: string
  order_products: [OrderProductType]
}
export interface OrderReturnType {
  id: number
  user_id: number
  status: string
  quantity: number
  product_id: number
  order_id: number
}
