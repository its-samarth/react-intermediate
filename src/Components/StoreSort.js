import React, { useState } from "react";

const StoreSort = ({ onApplySort }) => {
  const [sortOption, setSortOption] = useState("");
  const [order, setOrder] = useState("asc");

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
        {/* Sort by Name */}
        <div>
          <label htmlFor="sortName" className="block text-sm font-medium mb-1">
            Sort by Name
          </label>
          <select
            id="sortName"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Sort Option</option>
            <option value="name">Name</option>
          </select>
        </div>

        {/* Sort by Featured */}
        <div>
          <label htmlFor="sortFeatured" className="block text-sm font-medium mb-1">
            Sort by Featured Status
          </label>
          <select
            id="sortFeatured"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Sort Option</option>
            <option value="is_featured">Featured</option>
          </select>
        </div>

        {/* Sort by Popularity */}
        <div>
          <label htmlFor="sortPopularity" className="block text-sm font-medium mb-1">
            Sort by Popularity
          </label>
          <select
            id="sortPopularity"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Sort Option</option>
            <option value="clicks">Popularity (Clicks)</option>
          </select>
        </div>

        {/* Sort by Cashback */}
        <div>
          <label htmlFor="sortCashback" className="block text-sm font-medium mb-1">
            Sort by Cashback
          </label>
          <select
            id="sortCashback"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Sort Option</option>
            <option value="cashback_amount">Cashback Amount</option>
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
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StoreSort;
