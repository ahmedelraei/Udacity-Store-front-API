/* eslint-disable camelcase */
export interface OrderProductType {
  product_id: number
  order_id?: number
  quantity: number
}
export interface OrderProductReturnType {
  id: number
  product_id: number
  order_id: number
  quantity: number
}
