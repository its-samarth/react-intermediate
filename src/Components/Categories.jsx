import React, { useState, useEffect } from "react";
import axios from "axios";

const Categories = ({ className }) => {
  const [categoriesWithStores, setCategoriesWithStores] = useState([]);
  const [categoriesWithZeroStores, setCategoriesWithZeroStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
              {categoriesWithStores.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-in-out"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-sm text-gray-500">
                      {category.store_count} store{category.store_count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
              {categoriesWithStores.length === 0 && (
                <p className="text-center text-gray-500">No categories with stores available.</p>
              )}
            </div>
          </div>

          {/* Categories with zero stores */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Categories with Zero Stores</h2>
            <div className="flex flex-col space-y-6 max-h-[700px] overflow-y-auto">
              {categoriesWithZeroStores.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-in-out"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-sm text-gray-500">No stores available</p>
                  </div>
                </div>
              ))}
              {categoriesWithZeroStores.length === 0 && (
                <p className="text-center text-gray-500">No categories with zero stores available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
