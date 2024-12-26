import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce"; // Add lodash.debounce for performance

const AllStores = ({ className }) => {
  const [stores, setStores] = useState([]); // Stores data
  const [page, setPage] = useState(1); // Pagination
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // Check for more data
  const observer = useRef(); // Intersection Observer for infinite scroll

  // Fetch stores with pagination
  const fetchStores = async () => {
    if (isLoading || !hasMore) return; // Prevent duplicate calls
    setIsLoading(true);

    try {
      const response = await axios.get(`http://localhost:3001/stores?_page=${page}&_limit=10`);
      const newStores = response.data;

      if (newStores.length === 0) {
        setHasMore(false);
      } else {
        setStores((prevStores) => [...prevStores, ...newStores]);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lazy loading observer for infinite scrolling
  const lastStoreElementRef = useCallback(
    debounce((node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    }, 200), // Debounce for 200ms to reduce scroll-triggered calls
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchStores();
  }, [page]);

  const renderCashback = (store) => {
    if (!store.cashback_enabled) return "No cashback available";

    const amount =
      store.amount_type === "fixed"
        ? `$${store.cashback_amount.toFixed(2)}`
        : `${store.cashback_amount.toFixed(2)}%`;

    return `${store.rate_type} ${amount} cashback`;
  };

  return (
    <div className={`my-[50px] px-4 ${className}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">All Stores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stores.map((store, index) => (
          <div
            key={store.id}
            ref={stores.length === index + 1 ? lastStoreElementRef : null}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4 hover:shadow-xl transition-shadow duration-200 ease-in-out"
          >
            <img
              src={store.logo}
              alt={store.name}
              className="w-24 h-24 object-contain"
              loading="lazy"
            />
            <h2 className="text-lg font-semibold text-center">{store.name}</h2>
            <p className="text-sm text-gray-500 text-center">{renderCashback(store)}</p>
            <a
              href={store.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Visit Store
            </a>
          </div>
        ))}
      </div>
      {isLoading && <p className="text-center mt-6">Loading...</p>}
      {!hasMore && <p className="text-center mt-6">No more stores to display.</p>}
    </div>
  );
};

export default AllStores;
