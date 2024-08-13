import React from "react";

export default function SubcategoryCard({
  subcategory,
  onClick,
  isSelected,
  ...props
}) {
  return (
    <div {...props}>
      <div
        onClick={onClick}
        className={`p-4 border rounded-lg cursor-pointer ${
          isSelected ? "bg-[#725df5] text-white" : "bg-white text-black/80"
        }`}
      >
        <h2 className="font-semibold text-base">{subcategory}</h2>
      </div>
    </div>
  );
}
