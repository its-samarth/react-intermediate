import React, { useState } from "react";

const StoreSort = ({ onApplySort }) => {
  const [sortOption, setSortOption] = useState("");
  const [order, setOrder] = useState("");

  const sortOptions = [
    { value: "", label: "Select Sort Option" },
    { value: "name", label: "Name" },
    { value: "is_featured", label: "Featured Status" },
    { value: "clicks", label: "Popularity (Clicks)" },
    { value: "cashback_amount", label: "Cashback Amount" }
  ];

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSortOption(value);
    onApplySort(value, order);
  };

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setOrder(value);
    if (sortOption) {
      onApplySort(sortOption, value);
    }
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Sort Stores</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Combined Sort Options */}
        <div>
          <label htmlFor="sortOption" className="block text-sm font-medium mb-1">
            Sort By
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full border rounded px-3 py-2"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Order Selection */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
            Order
          </label>
          <select
            id="sortOrder"
            value={order}
            onChange={handleOrderChange}
            className="w-full border rounded px-3 py-2"
            disabled={!sortOption} // Disable if no sort option selected
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/*  Show current sort status */}
      {sortOption && (
        <div className="mt-4 text-sm text-gray-600">
          Sorting by: {sortOptions.find(opt => opt.value === sortOption)?.label} ({order === "asc" ? "ascending" : "descending"})
        </div>
      )}
    </div>
  );
};

export default StoreSort;