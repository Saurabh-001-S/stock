import { memo, useEffect } from "react";
import Traderow from "../Component/Traderow";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const StockList: React.FC = memo(() => {
  const navigate = useNavigate();
  const thClass =
    "px-2 py-2 text-left text-balance text-white font-serif font-thin text-sm border-b-2";
  const handleButton = () => {
    navigate("/add-entry");
  };

  const isUserLogin = () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/signin");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    isUserLogin();
  }, []);

  return (
    <div className="p-4 flex items-top justify-start h-svh w-3/4 flex-col items-center">
      <div className="p-4 flex gap-10 items-center justify-between w-1/2">
        <div className="bzv">
          <h1 className="font-bold text-4xl text-white">Users</h1>
          <p className="text-slate-300 pt-2">
            A list of all the trade in your account including their date, sl,
            etc.
          </p>
        </div>
        <div className="lh bwc bws bzw">
          <button
            type="button"
            className="flex-row flex w-32  bg-blue-600 rounded-md py-2 px-2 text-center m-1"
            onClick={handleButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="max-w-6 text-white"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"></path>
            </svg>
            <p className="text-white font-semibold">New Entry</p>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-2 py-2 text-left text-balance text-white font-serif font-thin text-sm border-b-2 w-4"
              >
                ID
              </th>
              <th scope="col" className={`${thClass} w-20`}>
                Contract
              </th>
              <th scope="col" className={`${thClass} w-28`}>
                Date
              </th>
              <th scope="col" className={`${thClass} w-20`}>
                Entry TF
              </th>
              <th scope="col" className={`${thClass} w-40`}>
                Entry res
              </th>
              <th scope="col" className={`${thClass} w-40`}>
                Exit res
              </th>
              <th scope="col" className={`${thClass} w-52`}>
                Description
              </th>
              <th scope="col" className={`${thClass} w-20`}>
                PNL
              </th>
              <th scope="col" className={`${thClass} w-12`}>
                WLD
              </th>
              <th scope="col" className={`${thClass} w-16 text-center`}>
                IMG
              </th>
              <th scope="col" className={`${thClass} w-16`}></th>
              <th scope="col" className={`${thClass} w-16`}></th>
            </tr>
          </thead>
          <Traderow />
        </table>
      </div>
    </div>
  );
});

export default StockList;
