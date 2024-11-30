import {OrderDetailType } from '../Types/OrderDetailType'



export default function OrderDetail({ detail }: { detail: OrderDetailType }) {
  return (
    <div className="order-details-item">
      <span>{detail.productName}</span>
      <span>Qty: {detail.quantity}</span>
      <span>{detail.totalPrice}$</span>
    </div>
  )
}
