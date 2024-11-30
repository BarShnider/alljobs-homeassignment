// ProductList.tsx
import { OrderDetailType } from "../types";

interface ProductListProps {
  orderDetails: OrderDetailType[];
  handleQuantityChange: (index: number, quantity: number) => void;
  handleRemoveProduct: (productID: number) => void;
}

export default function ProductList({
  orderDetails,
  handleQuantityChange,
  handleRemoveProduct,
}: ProductListProps) {
  return (
    <div className="new-order-details-wrapper">
      {orderDetails.map((detail, index) => (
        <div key={index} className="order-details-item">
          <span>{detail.productName}</span>
          <input
            className="quantity-input"
            type="number"
            min="1"
            value={detail.quantity}
            onChange={(e) =>
              handleQuantityChange(index, Number(e.target.value))
            }
          />
          <span>Total: {detail.totalPrice}$</span>
          <button
            className="product-item-total"
            onClick={() => handleRemoveProduct(detail.productID)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
