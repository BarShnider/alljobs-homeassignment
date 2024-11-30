import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

interface TableRowProps {
  order: {
    orderId: number;
    employeeName: string;
    customerName: string;
    shipperName: string;
    orderDate: string;
    orderTotalPrice: number;
  };
  onDelete: (orderId: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ order, onDelete }) => {
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent the row click if the Delete button is clicked
    if ((e.target as HTMLElement).tagName !== "BUTTON") {
      navigate(`details/${order.orderId}`);
    }
  };

  return (
    <div
      className="table-row"
      style={{ cursor: "pointer" }}
      onClick={handleRowClick}
    >
      <div className="table-cell" data-label="Order ID">
        {order.orderId}
      </div>
      <div className="table-cell" data-label="Employee Name">
        {order.employeeName}
      </div>
      <div className="table-cell" data-label="Customer Name">
        {order.customerName}
      </div>
      <div className="table-cell" data-label="Ship Name">
        {order.shipperName}
      </div>
      <div className="table-cell" data-label="Order Date">
        {order.orderDate.split("T")[0]}
      </div>
      <div className="table-cell" data-label="Order Total Price">
        {order.orderTotalPrice}$
      </div>
      <div className="table-cell" data-label="Actions">
        <div className="actions">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to={`${order.orderId}`}
            onClick={(e) => e.stopPropagation()} // Prevent row click when "Edit" link is clicked
          >
            <Button color="primary">Edit</Button>
          </Link>
          <Button
            color="error"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Prevent row click when "Delete" button is clicked
              onDelete(order.orderId);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableRow;
