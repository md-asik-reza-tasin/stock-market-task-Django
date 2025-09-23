import React from "react";

export default function InfoCard({ name, value, code, color }) {
  return (
    <div className={`md:w-56 h-32 ${color} shadow-xl`}>
      <h1 className="font-bold text-gray-400 text-sm ml-6 mt-5">{name}</h1>
      <p className="font-extrabold text-2xl ml-6 mt-3">
        {code === "SELECT TRADE CODE" ? "----" : value}
      </p>
    </div>
  );
}
