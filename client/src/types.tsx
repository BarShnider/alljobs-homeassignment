export interface Order {
    orderId: number;
    employeeId: number;
    employeeName: string;
    customerId: number;
    customerName: string;
    contactName: string;
    shipperId: number;
    shipperName: string;
    orderDate: string;
    requiredDate: string | null;
    orderTotalPrice: number;
    orderDetails: []; // Adjust if `orderDetails` has a known structure
  }

  export interface OrderDetailType {
    orderDetailID?: number;
    productID: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }

  export interface Product {
    productID: number;
    productName: string;
    price: number;
  }

  export interface OrderPayload {
    orderId: number;
    customerId: number;
    employeeId: number;
    shipperId: number;
    orderDate: string;
    requiredDate: string | null;
    orderDetails: {
      productID: number;
      quantity: number;
      unitPrice: number;
    }[];
  }