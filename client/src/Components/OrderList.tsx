import React, { useEffect, useState } from "react";
import ContainerWindow from "./ContainerWindow";
import { Order } from "../types";
import Autocomplete from "./Autocomplete";
import { useAppContext } from "../Contexts/AppContext";
import TableRow from "./TableRow";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  document.title = "All Orders";
  const navigate = useNavigate();
  const {
    fetchOrders,
    deleteOrder,
    handleOpenDialog,
    handleCloseDialog,
    dialogOpen,
  } = useAppContext();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ordersPerPage = 5;

  // Exports the current list of orders to a CSV file.
  // Creates a CSV file with headers and order details, then triggers a download.
  const handleExportToCSV = () => {
    const csvRows = [
      [
        "Order ID",
        "Employee",
        "Customer",
        "Shipper",
        "Order Date",
        "Order Total Price",
      ],
      ...orders.map((order) => [
        order.orderId,
        order.employeeName,
        order.customerName,
        order.shipperName,
        new Date(order.orderDate).toLocaleDateString(),
        order.orderTotalPrice,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sorts orders based on the `orderDate` field.
  // Applies ascending or descending sort order depending on the current `sortOrder` state.
  // Sorting is performed by comparing the timestamps of the order dates.
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortOrder) return 0;
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Implements pagination by slicing the sorted orders array.
  // Calculates the orders to display on the current page based on `currentPage` and `ordersPerPage`.
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Handles the delete operation for a specific order.
  // Opens a confirmation dialog to confirm the deletion of the order with the given ID.
  const handleDelete = (orderId: number) => {
    setOrderToDelete(orderId);
    handleOpenDialog();
  };

  // Confirms the deletion of an order after user confirmation.
  // Calls the `deleteOrder` function from the context and updates the state to remove the deleted order.
  const handleConfirmDelete = async () => {
    if (orderToDelete !== null) {
      try {
        await deleteOrder(orderToDelete);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderToDelete)
        );
      } catch (error) {
        setError("Failed to delete the order.");
      } finally {
        setOrderToDelete(null);
        handleCloseDialog();
      }
    }
  };

  // Cancels the delete operation and closes the confirmation dialog.
  // Resets the `orderToDelete` state to null.
  const handleCancelDelete = () => {
    setOrderToDelete(null);
    handleCloseDialog();
  };

  // Event Handlers
  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  return (
    <ContainerWindow wrapperClassName={"wide-orders-wrapper"}>
      <Autocomplete orders={orders} isMobile={false} />
      <div className="table-container">
        <div className="table-header">
          <div className="table-cell">Order ID</div>
          <div className="table-cell">Employee</div>
          <div className="table-cell">Customer</div>
          <div className="table-cell">Shipper</div>
          <div
            className="table-cell"
            onClick={handleSort}
            style={{ cursor: "pointer" }}
          >
            Order Date{" "}
            {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
          </div>
          <div className="table-cell">Order Total Price</div>
          <div className="table-cell">Actions</div>
        </div>
        <div className="mobile-sort">
          <button onClick={handleSort} className="sort-button">
            Sort by Date{" "}
            {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
          </button>
          <Autocomplete orders={orders} isMobile={true} />
        </div>
        <div className="table-body">
          {paginatedOrders.map((order) => (
            <TableRow
              key={order.orderId}
              order={order}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <div className="pagination">
          <div className="pagination-buttons pagination-desktop">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="active add-new-btn-mobile"
              onClick={() => navigate("new")}
            >
              Add New Order
            </button>
            <button onClick={handleExportToCSV} className="export-csv-button">
              Export to CSV
            </button>
          </div>
          <div className="pagination-buttons pagination-mobile">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div>
              <button
                className="active add-new-btn-mobile"
                onClick={() => navigate("new")}
              >
                Add
              </button>
              <button
                onClick={handleExportToCSV}
                className="export-csv-button responsive-export-button"
              >
                Export
              </button>
            </div>
          </div>
          <div className="pagination-buttons">
            {currentPage > 2 && (
              <>
                <button onClick={() => handlePageChange(1)}>1</button>
                {currentPage > 3 && <span>...</span>}
              </>
            )}
            {Array.from({ length: 3 }, (_, i) => {
              const page = currentPage - 1 + i;
              if (page > 0 && page <= totalPages) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage ? "active" : ""}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span>...</span>}
                <button onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this order?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </ContainerWindow>
  );
}
