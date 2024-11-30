// import { useParams } from "react-router-dom";
// import ContainerWindow from "./ContainerWindow";
// import { useEffect, useState } from "react";
// import OrderDetail from "./OrderDetail";
// import { OrderDetailType } from "../types";
// import { Order } from "../types";
// import { useAppContext } from "../Contexts/AppContext";
// import BackButton from "./BackButton";


// export default function OrderDetails() {
//   const { id } = useParams<{ id: string }>(); // Access the order ID from the URL
//   document.title = `Order No. ${id}`

//   const { API_URL, notifyFail,setIsLoading, fetchOrderDetails} = useAppContext();
//   const [orderInfo, setOrderInfo] = useState<Order | null>(null); // State for order info
//   const [orderDetails, setOrderDetails] = useState<OrderDetailType[]>([]); // State for product rows
//   const [error, setError] = useState<string | null>(null); // State for errors

//   // Fetch order info by ID
// //   const fetchOrderInfo = async (orderId: string) => {
// //   try {
// //     setIsLoading(true);
// //     const response = await fetch(
// //       `${API_URL}/Orders/GetOrderDetailsWithTotalPrice/${orderId}`
// //     );

// //     if (response.status === 404) {
// //       // If order is not found, navigate to the NotFound page
// //       navigate("*");
// //       return;
// //     }

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch order info: ${response.statusText}`);
// //     }

// //     const data: Order = await response.json();
// //     setOrderInfo(data);
// //   } catch (err) {
// //     const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
// //     setError(errorMessage);
// //     notifyFail(errorMessage);
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

//   // // Fetch order details (product rows) by ID
//   // const fetchOrderDetails = async (orderId: string) => {
//   //   try {
//   //     const response = await fetch(
//   //       `${API_URL}/OrderDetails/GetOrderDetailsByOrderId/${orderId}`
//   //     );
//   //     if (!response.ok) {
//   //       throw new Error(`Failed to fetch order details: ${response.statusText}`);
//   //     }
//   //     const data: OrderDetailType[] = await response.json();
//   //     setOrderDetails(data);
//   //   } catch (err) {
//   //     const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
//   //     setError(errorMessage);
//   //     notifyFail(errorMessage);    }
//   // };

//   useEffect(() => {
//     if (id) {
//       setIsLoading(true); // Start loading state
//       Promise.all([fetchOrderInfo(id), fetchOrderDetails(id)])
//         .catch((err) => setError(err instanceof Error ? err.message : "An unknown error occurred"))
//         .finally(() => setIsLoading(false)); // Stop loading state
//     }
//   }, [id]);


//   if (error) {
//     notifyFail(error)
//     return;
//   }

//   const totalOrderPrice = orderDetails.reduce(
//     (total, detail) => total + detail.totalPrice,
//     0
//   );

//   return (
//     <>
//     <ContainerWindow >
//       <BackButton />
//           <div className="order-details-wrapper">
//                       {/* Order and Customer Info */}
//           {orderInfo && (
//             <div className="order-info-top">
//               <div className="order-details">
//                 <h2 className="order-number-label">Order No. {orderInfo.orderId}</h2>
//                 <span className="order-date-label">
//                 {new Date(orderInfo.orderDate).toLocaleDateString()}
//                 </span>
//                 <span className="employee-label">
//                   Employee: {orderInfo.employeeName}
//                 </span>
//               </div>
//               <div className="vertical-line">

//               </div>
//               <div className="customer-details">
//                 <span className="customer-details-label">Customer Details</span>
//                 <span>
//                   <span className="bold-label">Name:</span> {orderInfo.customerName}
//                 </span>
//                 <span>
//                   <span className="bold-label">Contact Name:</span> {orderInfo.contactName}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Order Details */}
//           <div className="order-details-bottom">
//             {orderDetails.map((detail) => (
//               <OrderDetail key={detail.orderDetailID} detail={detail} />
//             ))}
//           </div>

//           {/* Total Price */}
//           {orderInfo && (
//             <div className="total-wrapper">
//               <span className="total-label">Total: {totalOrderPrice.toFixed(2)}$</span>
//             </div>
//           )}
//           </div>

//           </ContainerWindow>

//     </>
//   );
// }

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
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
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
          {/* {orderInfo && (
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
          )} */}
          {orderInfo && <OrderInfo orderInfo={orderInfo} />}


          {/* Order Details */}
          <div className="order-details-bottom">
            {orderDetails.map((detail) => (
              <OrderDetail key={detail.orderDetailID} detail={detail} />
            ))}
          </div>

          {/* Total Price */}
          {/* {orderInfo && (
            <div className="total-wrapper">
              <span className="total-label">Total: {totalOrderPrice.toFixed(2)}$</span>
            </div>
          )} */}
          {orderInfo && <OrderTotal total={totalOrderPrice} />}

        </div>
      </ContainerWindow>
    </>
  );
}
