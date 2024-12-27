import React, { useState } from "react";

// Separate CashbackDisplay component
const CashbackDisplay = ({ 
  cashback_enabled, 
  rate_type, 
  amount_type, 
  cashback_amount 
}) => {
  if (!cashback_enabled || cashback_enabled === "0") {
    return <span className="text-gray-500">No cashback available</span>;
  }

  const formatAmount = () => {
    const formattedAmount = Number(cashback_amount).toFixed(2);
    return amount_type === "fixed" ? `$${formattedAmount}` : `${formattedAmount}%`;
  };

  return (
    <div className="flex items-center space-x-1">
      <span className="text-green-600">
        {rate_type === "upto" ? "Up to " : ""}
        {formatAmount()}
        {" cashback"}
      </span>
    </div>
  );
};

const StoreFilters = ({ onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    cats: "",
    cashback_enabled: "",
    is_promoted: "",
    is_shareable: "",
    status: "",
    alphabet: "",
    rate_type: "",        // Added for cashback
    amount_type: "",   // Added for cashback
    cashback_amount: ""   // Added for cashback
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    let updatedFilters = { ...filters };

    if (updatedFilters.alphabet) {
      updatedFilters.name_like = `^${updatedFilters.alphabet.toLowerCase()}`;
      delete updatedFilters.alphabet;
    }

    if (updatedFilters.is_shareable === "") {
      delete updatedFilters.is_shareable;
    }

    onApplyFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      cats: "",
      cashback_enabled: "",
      is_promoted: "",
      is_shareable: "",
      status: "",
      alphabet: "",
      rate_type: "",
      amount_type: "",
      cashback_amount: ""
    });
    onClearFilters();
  };

  const alphabetOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Filter Stores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
        {/* Existing Category Filter */}
        <div>
          <label htmlFor="cats" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            type="number"
            id="cats"
            name="cats"
            value={filters.cats}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Category ID"
            min="1"
          />
        </div>

        {/* Enhanced Cashback Section */}
        <div className="space-y-2">
          <div>
            <label htmlFor="cashback_enabled" className="block text-sm font-medium mb-1">
              Cashback Enabled
            </label>
            <select
              id="cashback_enabled"
              name="cashback_enabled"
              value={filters.cashback_enabled}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          
          {filters.cashback_enabled === "1" && (
            <>
              <div>
                <label htmlFor="rate_type" className="block text-sm font-medium mb-1">
                  Rate Type
                </label>
                <select
                  id="rate_type"
                  name="rate_type"
                  value={filters.rate_type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="flat">Flat</option>
                  <option value="upto">Up to</option>
                </select>
              </div>

              <div>
                <label htmlFor="amount_type" className="block text-sm font-medium mb-1">
                  Amount Type
                </label>
                <select
                  id="amount_type"
                  name="amount_type"
                  value={filters.amount_type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label htmlFor="cashback_amount" className="block text-sm font-medium mb-1">
                  Cashback Amount
                </label>
                <input
                  type="number"
                  id="cashback_amount"
                  name="cashback_amount"
                  value={filters.cashback_amount}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  step="0.5"
                  min="0"
                />
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-sm font-medium mb-1">Preview:</label>
                <CashbackDisplay {...filters} />
              </div>
            </>
          )}
        </div>

        {/* Rest of your existing filters */}
        <div>
          <label htmlFor="is_promoted" className="block text-sm font-medium mb-1">
            Promoted
          </label>
          <select
            id="is_promoted"
            name="is_promoted"
            value={filters.is_promoted}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="is_shareable" className="block text-sm font-medium mb-1">
            Sharable
          </label>
          <select
            id="is_shareable"
            name="is_shareable"
            value={filters.is_shareable}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="publish">Publish</option>
            <option value="draft">Draft</option>
            <option value="trash">Trash</option>
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="alphabet" className="block text-sm font-medium mb-1">
            Filter by Alphabet
          </label>
          <div className="flex flex-wrap gap-1">
            {alphabetOptions.map((letter) => (
              <button
                key={letter}
                onClick={() => setFilters({ ...filters, alphabet: letter })}
                className={`px-2 py-1 text-xs border rounded ${
                  filters.alphabet === letter
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }w-1/2`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default StoreFilters;