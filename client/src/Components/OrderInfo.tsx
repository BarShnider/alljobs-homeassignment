// OrderInfo.tsx
import React from 'react';
import { Order } from '../types';

interface OrderInfoProps {
  orderInfo: Order;
}

export default function OrderInfo({ orderInfo }: OrderInfoProps) {
  return (
    <div className="order-info-top">
      <div className="order-details">
        <h2 className="order-number-label">Order No. {orderInfo.orderId}</h2>
        <span className="order-date-label">
          {new Date(orderInfo.orderDate).toLocaleDateString()}
        </span>
        <span className="employee-label">
          Employee: {orderInfo.employeeName}
        </span>
      </div>
      <div className="vertical-line"></div>
      <div className="customer-details">
        <span className="customer-details-label">Customer Details</span>
        <span>
          <span className="bold-label">Name:</span> {orderInfo.customerName}
        </span>
        <span>
          <span className="bold-label">Contact Name:</span> {orderInfo.contactName}
        </span>
      </div>
    </div>
  );
}
