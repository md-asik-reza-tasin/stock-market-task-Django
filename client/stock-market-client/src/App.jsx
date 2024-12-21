import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [stockData, setStockData] = useState([]);
  const [code, setCode] = useState("SELECT TRADE CODE");
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setStockData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [postData]);

  const tradeCode = [
    ...new Set(stockData.map((singleData) => singleData.trade_code)),
  ];

  const stockInfo = stockData.filter((data) => data.trade_code === code);
  // console.log(stockInfo);

  const handleNewStockData = (e) => {
    e.preventDefault();

    const target = e.target;
    const modal = document.getElementById("my_modal_4");

    const date = target.date.value;
    const tradeCode = target.tradecode.value;
    const high = target.high.value;
    const low = target.low.value;
    const open = target.open.value;
    const close = target.close.value;
    const volume = target.volume.value;

    const newStock = {
      date,
      tradeCode,
      high,
      low,
      low,
      open,
      close,
      volume,
    };

    fetch("http://127.0.0.1:5000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStock),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message && modal) {
          toast.success(data.message);
          setPostData(data);
          modal.close();
        }
      });
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <select
        className="select select-bordered mt-10"
        onChange={(e) => setCode(e.target.value)}
      >
        <option selected>SELECT TRADE CODE</option>
        {tradeCode.map((trade, idx) => (
          <option key={idx}>{trade}</option>
        ))}
      </select>
      <div className="mt-10">
        <button
          className="flex justify-center items-center gap-1"
          onClick={() => document.getElementById("my_modal_4").showModal()}
        >
          <MdAddCircleOutline className="size-4" />{" "}
          <p className="text-sm">ADD STOCK</p>
        </button>
      </div>
      <div>
        <Toaster />
      </div>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box p-16 w-11/12 max-w-5xl rounded-sm">
          <form
            onSubmit={handleNewStockData}
            className="grid grid-cols-2 gap-5"
          >
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              className="input input-bordered input-md w-full"
              name="date"
            />
            <input
              type="text"
              placeholder="trade_code"
              className="input input-bordered input-md w-full "
              name="tradecode"
            />
            <input
              type="number"
              placeholder="high"
              className="input input-bordered input-md w-full "
              name="high"
            />
            <input
              type="number"
              placeholder="low"
              className="input input-bordered input-md w-full "
              name="low"
            />
            <input
              type="number"
              placeholder="open"
              className="input input-bordered input-md w-full "
              name="open"
            />
            <input
              type="number"
              placeholder="close"
              className="input input-bordered input-md w-full "
              name="close"
            />
            <input
              type="number"
              placeholder="volume"
              className="input input-bordered input-md w-full col-span-2"
              name="volume"
            />
            <input
              type="submit"
              value="Submit"
              className="bg-black opacity-80 w-full col-span-2 text-white h-12 rounded-md"
            />
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="w-full h-full px-10 mt-5">
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
                <tr key={idx}>
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
