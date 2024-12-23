import { useRef, useState } from "react";
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
  const [date, setDate] = useState("");
  const [exist, setExist] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const location = useRef();
  const existCode = useRef();

  // console.log(code);

  //FETCH ALL THE TRADE CODE

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/trade_codes")
      .then((res) => res.json())
      .then((data) => {
        setStockData(data.tradeCode);
      });
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
  }, [postData, code, update, date === ""]);

  //ADD NEW STOCK

  const handleNewStockData = (e) => {
    e.preventDefault();

    setErrorMessage("");

    const target = e.target;
    const modal = document.getElementById("my_modal_4");

    const date = target.date.value;
    const tradeCode = exist;
    const high = target.high.value;
    const low = target.low.value;
    const open = target.open.value;
    const close = target.close.value;
    const volume = target.volume.value;

    if (volume.toString().length > 9) {
      return setErrorMessage("Volume is too big, It should not exceed 9 digit");
    } else if (high.toString().length > 5) {
      return setErrorMessage("high is too big, It should not exceed 5 digit");
    } else if (low.toString().length > 5) {
      return setErrorMessage("low is too big, It should not exceed 5 digit");
    } else if (close.toString().length > 9) {
      return setErrorMessage("close is too big, It should not exceed 9 digit");
    } else if (open.toString().length > 5) {
      return setErrorMessage("open is too big, It should not exceed 5 digit");
    } else {
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
            toast.success(`Stock information saved successfully`);
            setPostData(data);
            modal.close();
            target.reset();
          }
        });
    }
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
              const filter = stockData?.filter((data) => data.id !== id);
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
    const editData = stockData?.filter((single) => single.id === id);
    setcurrentData(editData);
  };

  //UPDATE STOCK DATA

  const handlecurrentData = (e, id) => {
    e.preventDefault();

    setErrorMessage("");

    const target = e.target;
    const modal = document.getElementById("my_modal_5");

    const date = target.date.value;
    const tradeCode = target.tradecode.value;
    const high = target.high.value;
    const low = target.low.value;
    const open = target.open.value;
    const close = target.close.value;
    const volume = target.volume.value;

    if (volume.toString().length >= 8) {
      return setErrorMessage("Volume is too big, It should not exceed 8 digit");
    } else if (high.toString().length > 6) {
      return setErrorMessage("high is too big, It should not exceed 6 digit");
    } else if (low.toString().length > 6) {
      return setErrorMessage("low is too big, It should not exceed 6 digit");
    } else if (close.toString().length >= 8) {
      return setErrorMessage("close is too big, It should not exceed 8 digit");
    } else if (open.toString().length > 6) {
      return setErrorMessage("open is too big, It should not exceed 6 digit");
    } else {
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
    }
  };

  //FIND OUT THE CLOSE AVG
  console.log(stockData);
  const closeAvg = stockData
    ?.reduce(
      (total, stock) =>
        isNaN(stock.close)
          ? total + parseInt(stock?.close?.toString()?.replace(/,/g, ""))
          : total + stock.close / stockData?.length,
      0
    )
    .toFixed(2);

  //FIND OUT THE VOLUME AVG

  const shortenNumber = (number) => {
    if (number >= 1e12) return (number / 1e12).toFixed(1) + "T";
    if (number >= 1e9) return (number / 1e9).toFixed(1) + "B";
    if (number >= 1e6) return (number / 1e6).toFixed(1) + "M";
    if (number >= 1e3) return (number / 1e3).toFixed(1) + "K";
    return number.toFixed(1);
  };

  const volumeAvg =
    stockData?.length > 0
      ? shortenNumber(
          stockData?.reduce(
            (total, stock) =>
              total + parseInt(stock?.volume?.toString()?.replace(/,/g, "")),

            0
          ) / stockData?.length
        )
      : 0;

  //SEARCH

  const handleSearch = () => {
    if (date.length) {
      const search = stockData?.filter((searchData) =>
        searchData.date.includes(date)
      );
      if (search.length > 0) {
        setStockData(search);
      } else {
        setStockData(stockData);
        toast.error("There is no data for this date.");
      }
    }
  };

  console.log(stockData);

  return (
    <div className="flex flex-col items-center">
      {/* WE CAN CHOOSE TRADE CODE HERE */}

      <select
        className="select select-bordered mt-10"
        onChange={(e) => {
          setCode(e.target.value);
          setExist("");
        }}
      >
        <option selected>SELECT TRADE CODE</option>
        {allTradeCode?.map((trade, idx) => (
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

      <div className="md:flex justify-between items-center mx-auto mt-5 w-full md:max-w-[1200px]">
        <button
          className="btn flex justify-center items-center gap-1 mt-0 md:mt-16 mx-auto md:mx-0"
          onClick={() => document.getElementById("my_modal_4").showModal()}
        >
          <MdAddCircleOutline className="size-4" />{" "}
          <p className="text-sm">ADD STOCK</p>
        </button>

        {stockData?.length > 0 && (
          <div className="mt-14">
            <h1 className="font-bold text-xl italic text-center">
              TOTAL STOCK DATA - {stockData.length}
            </h1>
          </div>
        )}

        <label className="form-control mt-4 md:ml-0 pt-6 mx-10">
          <div className="label">
            <span className="label-text">Search by date</span>
          </div>
          <div className="md:flex gap-2 ">
            <input
              ref={location}
              onChange={(e) => setDate(e.currentTarget.value)}
              type="date"
              placeholder="YYYY-MM-DD"
              value={date}
              className="input input-bordered input-sm w-full sm:max-w-xs"
            />
            <button
              onClick={handleSearch}
              className="bg-slate-500 w-full sm:w-24 h-8 text-white rounded-md mt-2 md:mt-0"
            >
              Search
            </button>
            <button
              className="bg-slate-500 w-full sm:w-20 h-8 text-white rounded-md mt-2 md:mt-0"
              onClick={() => setDate("")}
            >
              Clear
            </button>
          </div>
        </label>
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
            className="flex flex-col  md:grid  md:grid-cols-2 gap-5"
          >
            <input
              type="date"
              placeholder="YYYY-MM-DD"
              className="input input-bordered input-md w-full"
              name="date"
              required
            />

            <div className="relative">
              <input
                type="text"
                placeholder="Create new or select"
                className="input input-bordered input-md w-full "
                name="tradecode"
                value={exist}
                onChange={(e) => setExist(e.currentTarget.value)}
                required
              />
              {exist.length === 0 && (
                <details className="dropdown dropdown-end absolute right-3 top-2">
                  <summary className="m-1"></summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                      <p
                        onClick={() => {
                          setExist(existCode?.current?.innerHTML);
                        }}
                        ref={existCode}
                      >
                        {stockData?.[0]?.["trade_code"]}
                      </p>
                    </li>
                  </ul>
                </details>
              )}
            </div>

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
            <p className="text-red-600 text-center col-span-2">
              {errorMessage.length > 0 && errorMessage}
            </p>
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
        <div className="w-full h-full px-10 mt-5 ">
          <div className="overflow-x-auto flex justify-center mb-10">
            <div className="overflow-x-auto max-h-[1000px] w-[1200px]">
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
                      <td>{codeInfo?.volume?.toLocaleString()}</td>

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
                    className="flex flex-col md:grid md:grid-cols-2 gap-5"
                  >
                    <label>
                      <span className="mb-1">Date</span>
                      <input
                        type="date"
                        placeholder="YYYY-MM-DD"
                        className="input input-bordered input-md w-full"
                        name="date"
                        defaultValue={currentRow.date}
                      />
                    </label>
                    <label>
                      <span className="mb-2 ml-1">Trade Code</span>
                      <input
                        type="text"
                        placeholder="trade_code"
                        className="input input-bordered input-md w-full "
                        name="tradecode"
                        defaultValue={currentRow.trade_code}
                        disabled
                      />
                    </label>
                    <label>
                      <span className="mb-2 ml-1">High</span>
                      <input
                        type="number"
                        placeholder="high"
                        className="input input-bordered input-md w-full "
                        name="high"
                        step="any"
                        defaultValue={currentRow.high}
                      />
                    </label>
                    <label>
                      <span className="mb-2 ml-1">Low</span>
                      <input
                        type="number"
                        placeholder="low"
                        className="input input-bordered input-md w-full "
                        name="low"
                        step="any"
                        defaultValue={currentRow.low}
                      />
                    </label>
                    <label>
                      <span className="mb-2 ml-1">Open</span>
                      <input
                        type="number"
                        placeholder="open"
                        className="input input-bordered input-md w-full "
                        name="open"
                        step="any"
                        defaultValue={currentRow.open}
                      />
                    </label>
                    <label>
                      <span className="mb-2 ml-1">Close</span>
                      <input
                        type="number"
                        placeholder="close"
                        className="input input-bordered input-md w-full "
                        name="close"
                        step="any"
                        defaultValue={currentRow.close}
                      />
                    </label>
                    <label>
                      <span className="mb-2 ml-1">Volume</span>
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
                    </label>

                    {/* UPDATE MODAL BUTTON */}

                    <input
                      type="submit"
                      value="Update"
                      className="bg-black opacity-80 w-full col-span-2 text-white h-12 rounded-md"
                    />
                    <p className="text-red-600 text-center col-span-2">
                      {errorMessage.length > 0 && errorMessage}
                    </p>
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
