import { useParams } from "react-router-dom";
import ContainerWindow from "./ContainerWindow";
import { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import { OrderDetailType } from "../types";
import { Order } from "../types";
import { useAppContext } from "../Contexts/AppContext";
import BackButton from "./BackButton";
import OrderInfo from "./OrderInfo";
import OrderTotal from "./OrderTotal";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>(); // Access the order ID from the URL
  document.title = `Order No. ${id}`;

  const { fetchOrderDetails, notifyFail, setIsLoading } = useAppContext();
  const [orderInfo, setOrderInfo] = useState<Order | null>(null); // State for order info
  const [orderDetails, setOrderDetails] = useState<OrderDetailType[]>([]); // State for product rows
  const [error, setError] = useState<string | null>(null); // State for errors

  // Fetch order info and order details by ID
  useEffect(() => {
    const loadOrderDetails = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const orderData = await fetchOrderDetails(Number(id));
          if (orderData) {
            setOrderInfo(orderData);
            setOrderDetails(orderData.orderDetails);
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          setError(errorMessage);
          notifyFail(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOrderDetails();
  }, [id]);

  if (error) {
    notifyFail(error);
    return null;
  }

  const totalOrderPrice = orderDetails.reduce(
    (total, detail) => total + detail.totalPrice,
    0
  );

  return (
    <>
      <ContainerWindow>
        <BackButton />
        <div className="order-details-wrapper">
          {/* Order and Customer Info */}
          {orderInfo && <OrderInfo orderInfo={orderInfo} />}
          {/* Order Details */}
          <div className="order-details-bottom">
            {orderDetails.map((detail) => (
              <OrderDetail key={detail.orderDetailID} detail={detail} />
            ))}
          </div>
          {/* Total Price */}
          {orderInfo && <OrderTotal total={totalOrderPrice} />}
        </div>
      </ContainerWindow>
    </>
  );
}
