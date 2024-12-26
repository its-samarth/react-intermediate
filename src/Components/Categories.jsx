import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Categories = ({ className }) => {
  const [categoriesWithStores, setCategoriesWithStores] = useState([]);
  const [categoriesWithZeroStores, setCategoriesWithZeroStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // For handling the loaded items (pagination-like)
  const [visibleStores, setVisibleStores] = useState(25); // Initially show 25 items
  const [visibleZeroStores, setVisibleZeroStores] = useState(25);

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/categories");
        const categories = response.data;

        // Split categories into those with stores and those with zero stores
        const withStores = categories.filter((cat) => cat.store_count > 0);
        const zeroStores = categories.filter((cat) => cat.store_count === 0);

        setCategoriesWithStores(withStores);
        setCategoriesWithZeroStores(zeroStores);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Load more stores when user scrolls to the bottom
  const loadMoreStores = useCallback(() => {
    setVisibleStores((prev) => prev + 25); // Load more categories with stores
  }, []);

  const loadMoreZeroStores = useCallback(() => {
    setVisibleZeroStores((prev) => prev + 25); // Load more categories with zero stores
  }, []);

  // Set up an observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMoreStores(); // Load more when the bottom of the container is visible
          loadMoreZeroStores(); // Optional, you can add observer for both sections
        }
      },
      { threshold: 1.0 } // Trigger when 100% of the element is in view
    );

    const loadMoreTrigger = document.getElementById("load-more-trigger");
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger); // Observe the "Load More" trigger
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [loadMoreStores, loadMoreZeroStores]);

  return (
    <div className={`my-[50px] px-4 ${className}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Categories</h1>
      {isLoading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <>
          {/* Categories with stores */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Categories with Stores</h2>
            <div className="flex flex-col space-y-6 max-h-[700px] overflow-y-auto">
              {categoriesWithStores.slice(0, visibleStores).map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-in-out"
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-16 h-16 object-contain flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-sm text-gray-500">
                      {category.store_count} store{category.store_count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories with zero stores */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Categories with Zero Stores</h2>
            <div className="flex flex-col space-y-6 max-h-96 overflow-y-auto">
              {categoriesWithZeroStores.slice(0, visibleZeroStores).map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-in-out"
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-16 h-16 object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-sm text-gray-500">No stores available</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load More Trigger for IntersectionObserver */}
          <div id="load-more-trigger" className="h-8" />
        </>
      )}
    </div>
  );
};

export default Categories;
