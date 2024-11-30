import React from "react";

interface FormItemProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string | number; label: string }[]; // For dropdowns
  type?: "text" | "date" | "select";
  disabledOptionText?: string; // For dropdowns
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  type = "text",
  disabledOptionText = "Select an option",
}) => {
  return (
    <div className="form-item">
      <span>{label}:</span>
      {type === "select" && options ? (
        <select name={name} value={value} onChange={onChange}>
          <option disabled value="">
            {disabledOptionText}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} />
      )}
    </div>
  );
};

export default FormItem;
