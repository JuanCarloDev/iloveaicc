import React from "react";

export default function SegmentCard({
  segment,
  onClick,
  isSelected,
  ...props
}) {
  return (
    <div className={` col-span-4 lg:col-span-1`} {...props}>
      <div
        onClick={onClick}
        className={`p-4 border rounded-lg cursor-pointer ${
          isSelected ? "bg-[#725df5] text-white" : "bg-white text-black/80"
        }`}
      >
        <h2 className="font-semibold text-base">{segment.name}</h2>
      </div>
    </div>
  );
}
