import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [stockData, setStockData] = useState([]);
  const [code, setCode] = useState("SELECT TRADE CODE");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setStockData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const tradeCode = [
    ...new Set(stockData.map((singleData) => singleData.trade_code)),
  ];

  const stockInfo = stockData.filter((data) => data.trade_code === code);
  // console.log(stockInfo);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <select
        className="select select-bordered w-full max-w-xs mt-10"
        onChange={(e) => setCode(e.target.value)}
      >
        <option selected>SELECT TRADE CODE</option>
        {tradeCode.map((trade, idx) => (
          <option key={idx}>{trade}</option>
        ))}
      </select>
      <div className="w-full h-full px-10 mt-10">
        <div className="overflow-x-auto">
          <table className="table table-lg">
            <thead className="bg-black opacity-70 text-white">
              <tr>
                <th></th>
                <th>Date</th>
                <th>trade_code</th>
                <th>high</th>
                <th>low</th>
                <th>open</th>
                <th>close</th>
                <th>volume</th>
              </tr>
            </thead>

            <tbody>
              {stockInfo?.map((codeInfo, idx) => (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{codeInfo.date}</td>
                  <td>{codeInfo.trade_code}</td>
                  <td>{codeInfo.high}</td>
                  <td>{codeInfo.low}</td>
                  <td>{codeInfo.open}</td>
                  <td>{codeInfo.close}</td>
                  <td>{codeInfo.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
