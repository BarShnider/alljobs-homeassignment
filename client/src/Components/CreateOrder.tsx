import { useEffect, useState } from "react";
import ContainerWindow from "./ContainerWindow";
import { OrderDetailType, OrderPayload } from "../types";
import { Product } from "../types";
import { useParams } from "react-router-dom";
import { useAppContext } from "../Contexts/AppContext";
import FormItem from "./FormItem";
import ConfirmationDialog from "./ConfirmationDialog";
import BackButton from "./BackButton";
import ProductList from "./ProductList";

interface Customer {
  customerID: number;
  customerName: string;
}

interface Employee {
  employeeID: number;
  fullName: string;
}

interface Shipper {
  shipperID: number;
  shipperName: string;
}

interface DropdownData {
  customers: Customer[];
  employees: Employee[];
  shippers: Shipper[];
  products: Product[];
}

// Component for creating or editing an order
function CreateOrder({ editMode }: { editMode: boolean }) {
  document.title = editMode ? "Edit Order" : "Add New Order";
  const { id: orderId } = useParams();
  const {
    API_URL,
    notifyFail,
    notifySuccess,
    handleOpenDialog,
    handleCloseDialog,
    dialogOpen,
    setIsLoading,
    fetchOrderDetails,
    editOrder,
    createOrder,
  } = useAppContext();
  const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);

  // Define storage keys
  const formDataKey = "createOrderFormData";
  const orderDetailsKey = "createOrderDetails";

  // Initialize formData and orderDetails with localStorage if available
  const savedFormData = editMode
    ? {}
    : JSON.parse(localStorage.getItem(formDataKey) || "{}");
  const savedOrderDetails = editMode
    ? []
    : JSON.parse(localStorage.getItem(orderDetailsKey) || "[]");

  const [formData, setFormData] = useState({
    customerId: savedFormData.customerId || "",
    employeeId: savedFormData.employeeId || "",
    shipperId: savedFormData.shipperId || "",
    orderDate: savedFormData.orderDate || "",
    requiredDate: savedFormData.requiredDate || "",
  });

  const [orderDetails, setOrderDetails] =
    useState<OrderDetailType[]>(savedOrderDetails);

  const [selectedProductID, setSelectedProductID] = useState<number | null>(
    Number(dropdownData?.products[0].productID) || null 
  );

  // Persist form data to localStorage whenever formData changes (only for new orders)
  useEffect(() => {
    if (!editMode) {
      localStorage.setItem(formDataKey, JSON.stringify(formData));
    }
  }, [formData, formDataKey, editMode]);

  // Persist order details to localStorage whenever orderDetails changes (only for new orders)
  useEffect(() => {
    if (!editMode) {
      localStorage.setItem(orderDetailsKey, JSON.stringify(orderDetails));
    }
  }, [orderDetails, orderDetailsKey, editMode]);

  // Fetch data for dropdown menus (customers, employees, shippers, products).
  // This is triggered when the component mounts.
  // Displays a loading indicator while the data is being fetched.
  // If the fetch fails, it notifies the user.
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true); 
        const response = await fetch(`${API_URL}/DropdownData/GetDropdownData`);
        if (!response.ok) throw new Error("Failed to fetch dropdown data");
        const data: DropdownData = await response.json();
        setDropdownData(data); 
      } catch (error) {
        console.error(error);
        notifyFail("Failed to load dropdown data.");
      } finally {
        setIsLoading(false); 
      }
    };
    fetchDropdownData();
  }, []);

  // Populate the form and order details when editing an existing order.
  // Fetches the order details from the server and sets the state accordingly.
  const populateOrderData = async (orderId: number) => {
    const orderData = await fetchOrderDetails(orderId);
    if (orderData) {
      setFormData({
        customerId: orderData.customerId.toString(),
        employeeId: orderData.employeeId.toString(),
        shipperId: orderData.shipperId.toString(),
        orderDate: orderData.orderDate.split("T")[0],
        requiredDate: orderData.requiredDate?.split("T")[0] || "",
      });

      setOrderDetails(orderData.orderDetails);
      console.log(orderData);
    }
  };
  // Trigger order data population when in edit mode
  useEffect(() => {
    if (editMode && orderId) {
      populateOrderData(Number(orderId));
    }
  }, [editMode, orderId]);

  // If dropdown data is not loaded yet, don't render the form
  if (!dropdownData) return;

  // Add or update a product in the order details.
  // If the product is already in the order, increase its quantity and update the total price.
  // If the product is new, add it to the order with an initial quantity of 1.
  const handleAddProduct = () => {
    if (!selectedProductID) return;
    const product = dropdownData.products.find(
      (p) => p.productID === selectedProductID
    );
    if (!product) return;

    setOrderDetails((prevDetails) => {
      const existingProduct = prevDetails.find(
        (detail) => detail.productID === product.productID
      );
      if (existingProduct) {
        // Update the quantity and total price of an existing product
        return prevDetails.map((detail) =>
          detail.productID === product.productID
            ? {
                ...detail,
                quantity: detail.quantity + 1,
                totalPrice: (detail.quantity + 1) * detail.unitPrice,
              }
            : detail
        );
      } else {
        // Add a new product to the order
        return [
          ...prevDetails,
          {
            productID: product.productID,
            productName: product.productName,
            quantity: 1,
            unitPrice: product.price,
            totalPrice: product.price,
          },
        ];
      }
    });
  };

  // Update the quantity of a product in the order details.
  // This function is called when the user changes the quantity of a product.
  // It recalculates the total price based on the updated quantity.
  const handleQuantityChange = (index: number, quantity: number) => {
    setOrderDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      const detail = updatedDetails[index];
      detail.quantity = quantity;
      detail.totalPrice = detail.unitPrice * quantity;
      return updatedDetails;
    });
  };

  // Remove a product from the order details
  const handleRemoveProduct = (productID: number) => {
    setOrderDetails((prevDetails) =>
      prevDetails.filter((detail) => detail.productID !== productID)
    );
  };

  // Calculate the total price of the order
  const totalOrderPrice = orderDetails.reduce(
    (total, detail) => total + detail.totalPrice,
    0
  );

  // Handle changes in form inputs
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the order data to the server
  const handleSubmitOrder = async () => {
    // Validate required fields
    // Collect missing fields
    const missingFields: string[] = [];

    if (!formData.customerId) {
      missingFields.push("Customer");
    }
    if (!formData.employeeId) {
      missingFields.push("Employee");
    }
    if (!formData.shipperId) {
      missingFields.push("Shipper");
    }
    if (!formData.orderDate) {
      missingFields.push("Order Date");
    }

    // If there are any missing fields, notify the user and stop submission
    if (missingFields.length > 0) {
      notifyFail(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}.`
      );
      return;
    }

    // Validate date logic: if requiredDate is provided, it must be after orderDate
    if (formData.requiredDate) {
      const orderDate = new Date(formData.orderDate);
      const requiredDate = new Date(formData.requiredDate);

      if (requiredDate <= orderDate) {
        notifyFail("The required date must be after the order date.");
        return;
      }
    }
    const payload: OrderPayload = {
      orderId: orderId ? Number(orderId) : 0, // Ensure orderId is a number
      customerId: Number(formData.customerId),
      employeeId: Number(formData.employeeId),
      shipperId: Number(formData.shipperId),
      orderDate: formData.orderDate,
      requiredDate: formData.requiredDate || null,
      orderDetails: orderDetails.map((detail) => ({
        productID: detail.productID,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
      })),
    };

    try {
      if (editMode) {
        await editOrder(payload);
      } else {
        await createOrder(payload);
      }
    } catch (error) {
      notifyFail("An error occurred while submitting the order.");
    }
  };

  const handleClearLocalStorage = () => {
    localStorage.removeItem(formDataKey);
    localStorage.removeItem(orderDetailsKey);
    notifySuccess("Progress cleared.");
    setFormData({
      customerId: "",
      employeeId: "",
      shipperId: "",
      orderDate: "",
      requiredDate: "",
    });
    setOrderDetails([]);
  };

  // Handler to trigger the confirmation dialog before submitting updates
  const handleUpdateOrder = () => {
    handleOpenDialog();
  };

  // Confirm the update and proceed with submitting the order
  const handleConfirmUpdate = () => {
    handleCloseDialog();
    handleSubmitOrder();
  };

  return (
    <>
      <ContainerWindow wrapperClassName="wide-form-wrapper">
        <BackButton />
        <div className="create-form-wrapper">
          <h1 style={{ textAlign: "center" }}>
            {editMode ? `Edit Order ${orderId}` : `Add New Order`}
          </h1>

          <FormItem
            label="Customer"
            name="customerId"
            value={formData.customerId}
            onChange={handleFormChange}
            type="select"
            options={dropdownData.customers.map((customer) => ({
              value: customer.customerID,
              label: customer.customerName,
            }))}
            disabledOptionText="Select Customer"
          />

          <FormItem
            label="Employee"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleFormChange}
            type="select"
            options={dropdownData.employees.map((employee) => ({
              value: employee.employeeID,
              label: employee.fullName,
            }))}
            disabledOptionText="Select Employee"
          />

          <FormItem
            label="Order Date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleFormChange}
            type="date"
          />

          <FormItem
            label="Required Date"
            name="requiredDate"
            value={formData.requiredDate}
            onChange={handleFormChange}
            type="date"
          />

          <FormItem
            label="Shipper"
            name="shipperId"
            value={formData.shipperId}
            onChange={handleFormChange}
            type="select"
            options={dropdownData.shippers.map((shipper) => ({
              value: shipper.shipperID,
              label: shipper.shipperName,
            }))}
            disabledOptionText="Select Shipper"
          />

          {/* Add Product Dropdown */}
          <div className="add-product-item">
            <span>Product:</span>
            <select
              id="product"
              value=""
              onChange={(e) => setSelectedProductID(Number(e.target.value))}
            >
              <option disabled value="">
                Select Product
              </option>
              {dropdownData.products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productName}
                </option>
              ))}
            </select>
            <div
              className="plus-sign"
              onClick={handleAddProduct}
              style={{ cursor: "pointer" }}
            >
              Add
            </div>
          </div>

          <ProductList
            orderDetails={orderDetails}
            handleQuantityChange={handleQuantityChange}
            handleRemoveProduct={handleRemoveProduct}
          />
          <div
            className="total-label"
            style={{ textAlign: "right", marginTop: "20px" }}
          >
            <strong>Total Price: {totalOrderPrice.toFixed(2)}$</strong>
          </div>
          <div
            className="form-btns"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <button
              className="submit-btn"
              onClick={editMode ? handleUpdateOrder : handleSubmitOrder}
            >
              {editMode ? "Update" : "Create"}
            </button>
            {!editMode && (
              <button className="clear-btn" onClick={handleClearLocalStorage}>
                Clear
              </button>
            )}
          </div>
        </div>
      </ContainerWindow>
      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Update"
        message="Are you sure you want to update this order?"
        onConfirm={handleConfirmUpdate}
        onCancel={handleCloseDialog}
      />
    </>
  );
}

export default CreateOrder;
