import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import StoreFilters from "./StoreFilters";
import StoreSort from "./StoreSort";

const AllStores = ({ className }) => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStores, setTotalStores] = useState(0); // Track total stores count

  // React Router hook to manage URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchStores = async (filters, sortField = "", sortOrder = "asc") => {
    setIsLoading(true);

    let queryParams = Object.entries(filters)
      .filter(([_, value]) => value) // Ignore empty values
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    if (sortField) {
      queryParams += `&_sort=${sortField}&_order=${sortOrder}`;
    }

    const url = `http://localhost:3001/stores?${queryParams}`;

    try {
      const response = await axios.get(url);
      setStores(response.data);
      setTotalStores(response.data.length);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert search params to an object
  const getFiltersFromParams = () => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const handleApplyFilters = (filters) => {
    // Update the URL search parameters
    setSearchParams(filters);
  };

  const handleClearFilters = () => {
    // Clear search params and fetch stores without any filters
    setSearchParams({});
  };

  const handleApplySort = (sortField, sortOrder) => {
    const currentFilters = getFiltersFromParams();
    fetchStores(currentFilters, sortField, sortOrder);
  };

  useEffect(() => {
    // Fetch stores based on URL filters
    const initialFilters = getFiltersFromParams();
    fetchStores(initialFilters);
  }, [searchParams]);

  return (
    <div className={`my-[50px] px-4 ${className}`}>
      {/* Flex container for StoreFilters and StoreSort */}
      <div className="flex   mb-6  ">
        <div className="w-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <StoreFilters
            onApplyFilters={(filters) => handleApplyFilters(filters)}
            onClearFilters={handleClearFilters}
          />
        </div>
        <div className="w-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <StoreSort onApplySort={handleApplySort} />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Loading stores...</p>
      ) : (
        <>
          <div className="mb-6 flex justify-center items-center p-4 bg-gray-100 rounded-lg shadow-md max-w-xs mx-auto">
            <p className="text-lg font-medium text-gray-800">
              Total Stores:{" "}
              <span className="text-2xl font-semibold text-blue-600">
                {totalStores}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-200 ease-in-out"
              >
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-20 h-20 object-contain mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">{store.name}</h2>
                <p className="text-sm text-gray-500">
                  Cashback:{" "}
                  {store.cashback_enabled
                    ? `${store.rate_type} ${
                        store.amount_type === "fixed"
                          ? `$${store.cashback_amount}`
                          : `${store.cashback_amount}%`
                      }`
                    : "No cashback available"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllStores;
