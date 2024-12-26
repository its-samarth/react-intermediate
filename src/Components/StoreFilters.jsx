import React, { useState } from "react";

const StoreFilters = ({ onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    cats: "",
    cashback_enabled: "",
    is_promoted: "",
    is_sharable: "",
    status: "",
    alphabet: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    let updatedFilters = { ...filters };
    
    // If alphabet is set, update the filter to match stores starting with that letter.
    if (updatedFilters.alphabet) {
      updatedFilters.name_like = `^${updatedFilters.alphabet.toLowerCase()}`;  // Convert alphabet to lowercase and add regex for starting letter
      delete updatedFilters.alphabet;  // Remove alphabet to prevent it from being sent in the final filter object
    }

    onApplyFilters(updatedFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      cats: "",
      cashback_enabled: "",
      is_promoted: "",
      is_sharable: "",
      status: "",
      alphabet: "",
    });
    onClearFilters();
  };


  const alphabetOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Filter Stores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">



         {/* Category Filter */}
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
          />
        </div>

        {/* Cashback Filter */}
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
        
        {/* Promotion Filter */}
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

        {/* Sharable Filter */}
        <div>
          <label htmlFor="is_sharable" className="block text-sm font-medium mb-1">
            Sharable
          </label>
          <select
            id="is_sharable"
            name="is_sharable"
            value={filters.is_sharable}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
        
        {/* Status Filter */}
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

        {/* Alphabet Filter */}
        <div className="col-span-2">
          <label htmlFor="alphabet" className="block text-sm font-medium mb-1">
            Filter by Alphabet
          </label>
          <div className="flex flex-wrap gap-2">
            {alphabetOptions.map((letter) => (
              <button
                key={letter}
                onClick={() => setFilters({ ...filters, alphabet: letter })}
                className={`px-3 py-1 border rounded text-sm ${filters.alphabet === letter ? 'bg-blue-600 text-white' : 'bg-white'}`}
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
        
        {/* Clear Filters Button */}
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