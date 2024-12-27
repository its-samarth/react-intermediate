import React from "react";
import { useParams } from "react-router-dom";

const StoreHomepage = () => {
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Store </h1>
      <p className="text-lg text-gray-700">
        This is the homepage for Store .
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default StoreHomepage;
