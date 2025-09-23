import React from "react";

export default function DropDown({className, onChange, value}) {
  return (
    <select className={className} onChange={onChange}>
      <option selected>SELECT TRADE CODE</option>
      {value?.map((trade, idx) => (
        <option key={idx}>{trade}</option>
      ))}
    </select>
  );
}
