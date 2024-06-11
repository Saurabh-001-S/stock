import React, { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Traderow from "../Component/Traderow";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { RotateCcw } from "lucide-react";

const StockList: React.FC = memo(() => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    winlossdraw: "",
    region: "",
    startDate: "",
    endDate: "",
  });

  const thClass =
    "px-2 py-2 text-left text-balance text-white font-serif font-thin text-sm border-b-2";

  useEffect(() => {
    isUserLogin();
  }, []);

  const isUserLogin = () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/signin");
    } else {
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      winlossdraw: "",
      region: "",
      startDate: "",
      endDate: "",
    });
  };
  const resetData = useRef();
  const handleReset = () => {
    if (resetData.current) {
      resetData.current.fetchEntries();
    }
  };

  return (
    <div className="p-4 flex items-top justify-start h-svh flex-col items-center">
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
            onClick={() => navigate("/add-entry")}
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
              <th scope="col" className={`${thClass} w-12`}>
                Region
              </th>
              <th scope="col" className={`${thClass} w-16 text-center`}>
                IMG
              </th>
              <th scope="col" className={`${thClass} w-16`}>
                <button type="button" onClick={handleReset}>
                  <RotateCcw />
                </button>
              </th>
              <th scope="col" className={`${thClass} w-16`}>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-white hover:text-blue-200">
                      {filters.winlossdraw === "" &&
                      filters.region === "" &&
                      filters.endDate === "" &&
                      filters.startDate === "" ? (
                        <>
                          Filter
                          <ChevronDownIcon
                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </>
                      ) : (
                        <button
                          onClick={handleClearFilters}
                          className="flex justify-center items-center gap-1 border-2 rounded-md px-2 py-1 bg-gray-200 cursor-pointer"
                        >
                          <p className="text-black font-mono">Clear Filters</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="red"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-3 px-4 flex flex-col gap-2">
                        <select
                          id="winlossdraw"
                          name="winlossdraw"
                          autoComplete="winlossdraw"
                          className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={filters.winlossdraw}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="WIN">WIN</option>
                          <option value="LOSS">LOSS</option>
                          <option value="DRAW">DRAW</option>
                        </select>
                        <select
                          id="region"
                          name="region"
                          autoComplete="region"
                          className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={filters.region}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="IND">IND</option>
                          <option value="FOREX">FOREX</option>
                        </select>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700 mt-2"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={filters.startDate}
                          onChange={handleChange}
                          className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-gray-700 mt-2"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={filters.endDate}
                          onChange={handleChange}
                          className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
              </th>
            </tr>
          </thead>
          <Traderow filterQuery={filters} ref={resetData} />
        </table>
      </div>
    </div>
  );
});

export default StockList;
