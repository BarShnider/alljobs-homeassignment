import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Order, OrderPayload } from "../types";
import { useNavigate } from "react-router-dom";

// Define the shape of the context value
interface AppContextType {
  API_URL: string;
  notifySuccess: (text: string) => void;
  notifyFail: (text: string) => void;
  handleOpenDialog: () => void;
  handleCloseDialog: () => void;
  dialogOpen: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading:(isLoading:boolean) => void;
  fetchOrders: () => Promise<Order[]>; // Updated type
  fetchOrderDetails: (orderId: number) => Promise<Order | null>; // Updated type
  createOrder: (order: OrderPayload) => Promise<void>;
  editOrder: (order: OrderPayload) => Promise<void>;
  deleteOrder: (orderId: number) => Promise<void>; // Updated type
}

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the provider component
interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  const API_URL = `https://localhost:32773/api`;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('dark-mode') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false)
  const notifySuccess = (text: string) => toast.success(text);
  const notifyFail = (text: string) => toast.error(text);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Set data-theme attribute to switch between themes
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // Save preference in local storage
    localStorage.setItem('dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/Orders/GetOrdersListWithTotalPrice`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    } catch (error) {
      console.error(error);
      notifyFail("Failed to load orders.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchOrderDetails = async (orderId: number) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`${API_URL}/Orders/GetOrderDetailsWithTotalPrice/${orderId}`);
  //     if (!response.ok) throw new Error("Failed to fetch order details");
  //     return await response.json();
  //   } catch (error) {
  //     console.error(error);
  //     notifyFail("Failed to load order details.");
  //     return null;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const fetchOrderDetails = async (orderId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/Orders/GetOrderDetailsWithTotalPrice/${orderId}`);
      if (response.status === 404) {
        // Handle case when order does not exist
        navigate("*")
        notifyFail(`Order with ID ${orderId} was not found.`);
        return null;
      }
      if (!response.ok) throw new Error("Failed to fetch order details");
      return await response.json();
    } catch (error) {
      console.error(error);
      notifyFail("Failed to load order details.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createOrder = async (order: OrderPayload) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/Orders/InsertOrderWithDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error("Failed to create order");
      notifySuccess("Order created successfully!");
    } catch (error) {
      console.error(error);
      notifyFail("Failed to create order.");
    } finally {
      setIsLoading(false);
    }
  };

  const editOrder = async (order: OrderPayload) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/Orders/EditOrder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error("Failed to edit order");
      notifySuccess("Order updated successfully!");
    } catch (error) {
      console.error(error);
      notifyFail("Failed to edit order.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/Orders/DeleteOrderById/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");
      notifySuccess("Order deleted successfully!");
    } catch (error) {
      console.error(error);
      notifyFail("Failed to delete order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        API_URL,
        notifySuccess,
        notifyFail,
        handleOpenDialog,
        handleCloseDialog,
        dialogOpen,
        isDarkMode,
        toggleDarkMode,
        isLoading,
        setIsLoading,
        fetchOrders,
        fetchOrderDetails,
        createOrder,
        editOrder,
        deleteOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Create a custom hook to consume the context
function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export { AppProvider, useAppContext };
