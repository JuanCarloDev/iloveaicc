import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import React from "react";

export default function SearchBar({ searchTerm, setSearchTerm, ...props }) {
  return (
    <div className={`w-full`} {...props}>
      <div className="flex w-full h-12 max-w-5xl bg-white border border-gray-300 rounded-lg mt-4">
        <div className="flex justify-center items-center pl-4 pr-2">
          <MagnifyingGlass className={`text-black/40`} size={18} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full h-full pl-2 text-black border-none outline-none rounded-r-lg"
        />
      </div>
    </div>
  );
}
