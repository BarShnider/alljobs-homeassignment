// ProductForm.tsx
import React from "react";
import { Product } from "../types";

interface ProductFormProps {
  products: Product[];
  selectedProductID: number | null;
  setSelectedProductID: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddProduct: () => void;
}

export default function ProductForm({
  products,
  selectedProductID,
  setSelectedProductID,
  handleAddProduct,
}: ProductFormProps) {
  return (
    <div className="add-product-item">
      <span>Product:</span>
      <select
        id="product"
        value={selectedProductID || ""}
        onChange={(e) => setSelectedProductID(Number(e.target.value))}
      >
        <option disabled value="">
          Select Product
        </option>
        {products.map((product) => (
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
  );
}
