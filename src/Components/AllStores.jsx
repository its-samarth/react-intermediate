import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import StoreFilters from "./StoreFilters";
import StoreSort from "./StoreSort";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import BeatLoader from "react-spinners/BeatLoader";

const AllStores = ({ className }) => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStores, setTotalStores] = useState(0);
  const [searchState, setSearchState] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(18);
  const [hasMore, setHasMore] = useState(true);
  const [currentSort, setCurrentSort] = useState({ field: "", order: "" });

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchStores = async (isNewFilter = false) => {
    if (!hasMore && !isNewFilter) return;

    setIsLoading(true);
    
    // Get current filters from URL params
    const filters = getFiltersFromParams();
    
    let queryParams = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Add sorting parameters if they exist
    if (currentSort.field) {
      queryParams += `&_sort=${currentSort.field}&_order=${currentSort.order}`;
    }

    // Add pagination parameters
    queryParams += `&_page=${page}&_limit=${limit}`;

    const url = `http://localhost:3001/stores?${queryParams}`;

    try {
      const response = await axios.get(url);
      
      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }

      setStores(prevStores => {
        const newStores = isNewFilter ? response.data : [...prevStores, ...response.data];
        const uniqueStores = Array.from(
          new Map(newStores.map(store => [store.id, store])).values()
        );
        return uniqueStores;
      });

      // Update filtered stores based on current search
      const newStores = isNewFilter ? response.data : [...stores, ...response.data];
      const uniqueStores = Array.from(
        new Map(newStores.map(store => [store.id, store])).values()
      );
      
      const filtered = searchState
        ? uniqueStores.filter(store =>
            store.name.toLowerCase().includes(searchState.toLowerCase())
          )
        : uniqueStores;
      
      setFilteredStores(filtered);
      setTotalStores(filtered.length);
      
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for handling URL parameter changes
  useEffect(() => {
    setStores([]);
    setFilteredStores([]);
    setPage(1);
    setHasMore(true);
    fetchStores(true);
  }, [searchParams, currentSort]);

  // Effect for infinite scrolling
  useEffect(() => {
    if (page > 1) {
      fetchStores(false);
    }
  }, [page]);

  const handleInfiniteScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 20 >=
        document.documentElement.scrollHeight &&
      hasMore &&
      !isLoading
    ) {
      setPage(prev => prev + 1);
    }
  }, 100);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [hasMore, isLoading]);

  const getFiltersFromParams = () => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const handleApplyFilters = (filters) => {
    setSearchParams(filters);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handleApplySort = (sortField, sortOrder) => {
    setCurrentSort({ field: sortField, order: sortOrder });
  };

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchState(searchValue);

    const filtered = stores.filter((store) =>
      store.name.toLowerCase().includes(searchValue)
    );
    setFilteredStores(filtered);
    setTotalStores(filtered.length);
  };

  return (
    <div className={`my-[50px] px-4 ${className}`}>
      <div className="flex mb-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <StoreFilters
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      <div className="flex mb-6">
        <div className="w-1/2 flex justify-center items-center bg-gray-100 rounded-lg shadow-md max-w-xs mx-auto">
          <p className="text-lg font-medium text-gray-800">
            Total Stores:{" "}
            <span className="text-2xl font-semibold text-blue-600">
              {totalStores}
            </span>
          </p>
        </div>
        <div className="w-1/2 flex bg-white rounded-lg">
          <StoreSort onApplySort={handleApplySort} />
        </div>
      </div>

      <>
        <div className="mb-6 flex justify-center items-center p-4 bg-gray-100 rounded-lg shadow-md max-w-xs mx-auto">
          <input
            type="text"
            placeholder="Search for Stores"
            value={searchState}
            onChange={handleSearchInputChange}
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          />
          <SearchIcon className="text-gray-500 ml-2 cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
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
                {!store.cashback_enabled || store.cashback_enabled === "0" ? (
                  "No cashback available"
                ) : (
                  <span className="text-green-600">
                    {store.rate_type === "upto" ? "Up to " : "Flat "}
                    {store.amount_type === "fixed"
                      ? `$${Number(store.cashback_amount).toFixed(2)}`
                      : `${Number(store.cashback_amount).toFixed(2)}%`}
                    {" cashback"}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {isLoading && hasMore && (
          <div className="fixed bottom-10 left-0 right-0 flex justify-center items-center py-4">
            <BeatLoader
              color={"#000000"}
              loading={isLoading}
              size={15}
              speedMultiplier={5}
            />
          </div>
        )}

        {!hasMore && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 font-medium">Reached end of stores.</p>
          </div>
        )}
      </>
    </div>
  );
};

export default AllStores;