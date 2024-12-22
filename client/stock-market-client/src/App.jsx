import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import {
  MdAddCircleOutline,
  MdDeleteOutline,
  MdModeEdit,
} from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import ChartOfStockData from "./ChartOfStockData";

function App() {
  const [stockData, setStockData] = useState([]);
  const [code, setCode] = useState("SELECT TRADE CODE");
  const [postData, setPostData] = useState(null);
  const [allTradeCode, setAllTradeCode] = useState([]);
  const [currentData, setcurrentData] = useState([]);
  const [update, setUpdate] = useState(null);

  //FETCH ALL THE TRADE CODE

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/trade_codes")
      .then((res) => res.json())
      .then((data) => setAllTradeCode(data.trade_codes));
  }, [postData]);

  //FETCH STOCK DATA ACCORDING TO TRADE CODE

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/data?trade_code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        setStockData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [postData, code, update]);

  //ADD NEW STOCK

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
          toast.success(`${tradeCode} trade code added successfully`);
          setPostData(data);
          modal.close();
          target.reset();
        }
      });
  };

  //DELETE SPECIFIC STOCK DATA

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you to delete it?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://127.0.0.1:5000/api/data/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message) {
              toast.success(data.message);
              const filter = stockData.filter((data) => data.id !== id);
              setStockData(filter);
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    });
  };

  //FOR SHOWING THE MODAL (SPECIFIC STOCK DATA ACCORDING TO ID)

  const handleEdit = (id) => {
    const editData = stockData.filter((single) => single.id === id);
    setcurrentData(editData);
  };

  //UPDATE STOCK DATA

  const handlecurrentData = (e, id) => {
    e.preventDefault();

    const target = e.target;
    const modal = document.getElementById("my_modal_5");

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

    fetch(`http://127.0.0.1:5000/api/data/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStock),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message && modal) {
          toast.success(data.message);
          setUpdate(data);
          modal.close();
          target.reset();
        }
      });
  };

  //FIND OUT THE CLOSE AVG

  const closeAvg = stockData
    .reduce((total, stock) => total + stock.close / stockData.length, 0)
    .toFixed(2);

  //FIND OUT THE VOLUME AVG

  const volumeAvg = stockData
    .reduce(
      (total, stock) =>
        total +
        parseInt(stock.volume.toString().replace(/,/g, "")) / stockData.length,
      0
    )
    .toFixed(2);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      {/* WE CAN CHOOSE TRADE CODE HERE */}

      <select
        className="select select-bordered mt-10"
        onChange={(e) => setCode(e.target.value)}
      >
        <option selected>SELECT TRADE CODE</option>
        {allTradeCode.map((trade, idx) => (
          <option key={idx}>{trade}</option>
        ))}
      </select>

      {/* SHOWING THE CHART */}

      <div className="grid grid-cols-1 md:grid-cols-4 w-full md:w-[1200px] md:border p-10 mt-10 gap-10">
        {/* CHART */}

        <div className="md:col-span-3">
          <ChartOfStockData stockData={stockData}></ChartOfStockData>
        </div>

        {/* TRADE CODE , CLOSE AVG, VOLUME AVG */}

        <div className="grid grid-cols-1 mt-12 gap-5">
          <div className="md:w-56 h-32 bg-red-100 shadow-xl">
            <h1 className="font-bold text-gray-400 text-sm ml-6 mt-5">
              Trade Code
            </h1>
            <p className="font-extrabold text-2xl ml-6 mt-3">
              {code === "SELECT TRADE CODE" ? "----" : code}
            </p>
          </div>
          <div className="md:w-56 h-32 bg-orange-100 shadow-xl">
            <h1 className="font-bold text-gray-400 text-sm ml-6 mt-5">
              Close Average
            </h1>
            <p className="font-extrabold text-2xl ml-6 mt-3">
              {code === "SELECT TRADE CODE" ? "----" : closeAvg}
            </p>
          </div>
          <div className="md:w-56 h-32 bg-yellow-100 shadow-xl">
            <h1 className="font-bold text-gray-400 text-sm ml-6 mt-5">
              Volume Average
            </h1>
            <p className="font-extrabold text-2xl ml-6 mt-3">
              {code === "SELECT TRADE CODE" ? "----" : volumeAvg}
            </p>
          </div>
        </div>
      </div>

      {/* HERE WE CAN ADD NEW STOCK */}

      <div className="mt-10">
        <button
          className="flex justify-center items-center gap-1"
          onClick={() => document.getElementById("my_modal_4").showModal()}
        >
          <MdAddCircleOutline className="size-4" />{" "}
          <p className="text-sm">ADD STOCK</p>
        </button>
      </div>

      {/* TOAST */}

      <div>
        <Toaster />
      </div>

      {/* MODAL FOR SHOWING THE FORM */}

      <dialog id="my_modal_4" className="modal">
        <div className="modal-box p-16 w-11/12 max-w-5xl rounded-sm">
          <form
            onSubmit={handleNewStockData}
            className="grid grid-cols-2 gap-5"
          >
            <input
              type="date"
              placeholder="YYYY-MM-DD"
              className="input input-bordered input-md w-full"
              name="date"
              required
            />
            <input
              type="text"
              placeholder="trade_code"
              className="input input-bordered input-md w-full "
              name="tradecode"
              required
            />
            <input
              type="number"
              placeholder="high"
              className="input input-bordered input-md w-full "
              name="high"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="low"
              className="input input-bordered input-md w-full "
              name="low"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="open"
              className="input input-bordered input-md w-full "
              name="open"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="close"
              className="input input-bordered input-md w-full "
              name="close"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="volume"
              className="input input-bordered input-md w-full col-span-2"
              name="volume"
              step="any"
              required
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

      {/* HERE WE CAN SEE THE TABLE OF STOCK DATA */}

      {code && (
        <div className="w-full h-full px-10 mt-5">
          <div className="overflow-x-auto flex justify-center">
            <div className="overflow-x-auto max-h-[680px] w-[1200px]">
              <table className="table-sm lg:table-lg text-center w-full min-w-max">
                <thead className="bg-black opacity-70 text-white sticky top-0 z-10">
                  <tr>
                    <th></th>
                    <th>Date</th>
                    <th>trade_code</th>
                    <th>high</th>
                    <th>low</th>
                    <th>open</th>
                    <th>close</th>
                    <th>volume</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {stockData?.map((codeInfo, idx) => (
                    <tr key={idx} className="border-b">
                      <td>{idx + 1}</td>
                      <td>{codeInfo.date}</td>
                      <td>{codeInfo.trade_code}</td>
                      <td>{codeInfo.high}</td>
                      <td>{codeInfo.low}</td>
                      <td>{codeInfo.open}</td>
                      <td>{codeInfo.close}</td>
                      <td>{codeInfo.volume.toLocaleString()}</td>

                      {/* WE CAN DELETE SPECIFIC DATA */}
                      <td className="flex justify-center items-center gap-5">
                        <button
                          onClick={() => handleDelete(codeInfo.id)}
                          className="btn btn-sm btn-outline btn-error"
                        >
                          Delete
                          <MdDeleteOutline className="text-red-600" />
                        </button>

                        {/* EDIT BUTTON, FOR UPDATE DATA */}

                        <button
                          onClick={() => {
                            document.getElementById("my_modal_5").showModal();
                            handleEdit(codeInfo.id);
                          }}
                          className="btn btn-sm btn-outline btn-info"
                        >
                          Edit
                          <MdModeEdit className="text-sky-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MODAL FOR SHOWING FORM, WE CAN UPDATE OUR STOCK DATA */}

            <dialog id="my_modal_5" className="modal">
              <div className="modal-box  max-w-5xl p-20">
                {currentData.map((currentRow, idx) => (
                  <form
                    key={idx}
                    onSubmit={(e) => handlecurrentData(e, currentRow.id)}
                    className="grid grid-cols-2 gap-5"
                  >
                    <input
                      type="date"
                      placeholder="YYYY-MM-DD"
                      className="input input-bordered input-md w-full"
                      name="date"
                      defaultValue={currentRow.date}
                    />
                    <input
                      type="text"
                      placeholder="trade_code"
                      className="input input-bordered input-md w-full "
                      name="tradecode"
                      defaultValue={currentRow.trade_code}
                    />
                    <input
                      type="number"
                      placeholder="high"
                      className="input input-bordered input-md w-full "
                      name="high"
                      step="any"
                      defaultValue={currentRow.high}
                    />
                    <input
                      type="number"
                      placeholder="low"
                      className="input input-bordered input-md w-full "
                      name="low"
                      step="any"
                      defaultValue={currentRow.low}
                    />
                    <input
                      type="number"
                      placeholder="open"
                      className="input input-bordered input-md w-full "
                      name="open"
                      step="any"
                      defaultValue={currentRow.open}
                    />
                    <input
                      type="number"
                      placeholder="close"
                      className="input input-bordered input-md w-full "
                      name="close"
                      step="any"
                      defaultValue={currentRow.close}
                    />
                    <input
                      type="number"
                      placeholder="volume"
                      className="input input-bordered input-md w-full col-span-2"
                      name="volume"
                      defaultValue={parseInt(
                        String(currentRow.volume).replace(/,/g, ""),
                        10
                      )}
                    />
                    <input
                      type="submit"
                      value="Update"
                      className="bg-black opacity-80 w-full col-span-2 text-white h-12 rounded-md"
                    />
                  </form>
                ))}
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
