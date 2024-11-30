import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface AutocompleteProps {
  orders: {
    orderId: number;
    customerName: string;
    contactName?: string;
    employeeName: string;
  }[];
  isMobile: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ orders, isMobile }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof orders>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // This function is triggered whenever the user types into the search input field.
  // It updates the search query state and filters the orders list based on the user's input.
  // The function performs case-insensitive filtering by converting both the user input and the order fields to lowercase.
  // If the input is empty, it clears the suggestions and hides the dropdown.
  // If there are matching results, it displays the suggestions dropdown.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // If the input field is cleared, reset suggestions and hide the dropdown
    if (value.trim() === "") {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }

    const lowerCaseQuery = value.toLowerCase();

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
  // This ensures that the input field is reset and no suggestions are displayed after a selection is made
  const handleSuggestionClick = (orderId: number) => {
    setQuery("");
    setSuggestions([]);
    setIsDropdownVisible(false);
  };

  // Handles clicks outside the input field or dropdown to hide the suggestions dropdown.
  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) && //Check if the click is outside the input field
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) //Check if the click is outside the dropdown
    ) {
      setIsDropdownVisible(false); // Close dropdown if clicking outside
    }
  };

  // Add event listeners to detect clicks outside the component and clean up on unmount.
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${isMobile ? "mobile-autocomplete" : "desktop-autocomplete"}`}
    >
      {/* Search input field */}
      <input
        ref={inputRef}
        className="search-input-field"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search by customer, contact, or employee..."
      />
      {/* Dropdown suggestions */}
      {isDropdownVisible && suggestions.length > 0 && (
        <ul ref={dropdownRef} className="autocomplete-list-item">
          {suggestions.map((order) => (
            <Link
              key={order.orderId}
              className="autocomplete-link"
              to={`details/${order.orderId}`}
            >
              <li
                className="autocomplete-li"
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
