import React, { useState } from "react";
import { Link } from "react-router-dom";

// Interface defining the props for the Autocomplete component
interface AutocompleteProps {
  orders: {
    orderId: number;
    customerName: string;
    contactName?: string;
    employeeName: string;
  }[];
  isMobile: boolean;
}

// Autocomplete component for searching and selecting orders
const Autocomplete: React.FC<AutocompleteProps> = ({ orders, isMobile }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof orders>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // This function is triggered whenever the user types into the search input field.
  // It updates the search query state and filters the orders list based on the user's input.
  // The function performs case-insensitive filtering by converting both the user input and the order fields to lowercase.
  // If the input is empty, it clears the suggestions and hides the dropdown.
  // If there are matching results, it displays the suggestions dropdown.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // If the input is empty, clear suggestions and hide the dropdown
    if (value.trim() === "") {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }

    // Convert the query to lowercase for case-insensitive filtering
    const lowerCaseQuery = value.toLowerCase();

    // Filter orders based on customer name, contact name, or employee name
    const filtered = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(lowerCaseQuery) ||
        (order.contactName?.toLowerCase() || "").includes(lowerCaseQuery) ||
        order.employeeName.toLowerCase().includes(lowerCaseQuery)
    );

    setSuggestions(filtered);
    setIsDropdownVisible(true);
  };

  // This function is triggered when the user clicks on one of the suggestions in the dropdown list.
  // It clears the search query and the suggestions list, effectively hiding the dropdown.
  // This ensures that the input field is reset and no suggestions are displayed after a selection is made.
  const handleSuggestionClick = (orderId: number) => {
    setQuery("");
    setSuggestions([]);
    setIsDropdownVisible(false);
  };

  // Handle blur events to hide the dropdown when the input loses focus
  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownVisible(false); // Close dropdown after clicking outside
    }, 100);
  };

  return (
    <div
      className={`${isMobile ? "mobile-autocomplete" : "desktop-autocomplete"}`}
    >
      {/* Search input field */}
      <input
        className="search-input-field"
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Search by customer, contact, or employee..."
      />
      {/* Dropdown suggestions */}
      {isDropdownVisible && suggestions.length > 0 && (
        <ul className="autocomplete-list-item">
          {suggestions.map((order) => (
            <Link
              key={order.orderId}
              className="autocomplete-link"
              to={`details/${order.orderId}`}
            >
              <li
                className="autocomplete-li"
                key={order.orderId}
                onClick={() => handleSuggestionClick(order.orderId)}
              >
                Order No. {order.orderId} -{" "}
                <strong>{order.customerName}</strong> - {order.employeeName}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
