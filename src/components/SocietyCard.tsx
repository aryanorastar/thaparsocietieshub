import React, { useState } from "react";

const SocietyCard = ({ society }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 w-80 h-96 relative cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-500 ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-white shadow-lg rounded-xl flex flex-col p-4">
          <h2 className="text-lg font-bold">{society.name}</h2>
          <p className="text-sm text-gray-600">{society.category}</p>
          <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded">
            More Info
          </button>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-gray-800 text-white shadow-lg rounded-xl p-4 flex flex-col justify-center rotate-y-180">
          <p className="text-sm">{society.description}</p>
          <button className="mt-auto bg-red-500 text-white py-2 px-4 rounded">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocietyCard;
