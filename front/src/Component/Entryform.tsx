import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Timeframe = {
  "1 min": "MIN1";
  "2 min": "MIN2";
  "5 min": "MIN5";
  "1 hour": "HOUR1";
};
type WINLOSSDRAW = "WIN" | "LOSS" | "DRAW";

const timeframes: Timeframe = {
  "1 min": "MIN1",
  "2 min": "MIN2",
  "5 min": "MIN5",
  "1 hour": "HOUR1",
};
const Objecttimeframe = {
  MIN1: "1 min",
  MIN2: "2 min",
  MIN5: "5 min",
  HOUR1: "1 hour",
};
const winLossDrawOptions: WINLOSSDRAW[] = ["WIN", "LOSS", "DRAW"];

interface FormProps {
  setModal?: React.Dispatch<React.SetStateAction<boolean>>;
  Formtype: string;
}

const Entryform: React.FC<FormProps> = memo(({ setModal, Formtype }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Correct usage of useParams
  const [formInput, setFormInput] = useState({
    contract: "",
    entryTimeFrame: "1 min",
    entryReason: "",
    exitReason: "",
    description: "",
    pnl: 0,
    winlossdraw: "DRAW",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditEntry = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/stockRoute/find-stockEntry/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.status == 200) {
        const entry = res.data.data;
        setFormInput({
          contract: entry.contract,
          entryTimeFrame: Objecttimeframe[entry.entryTimeFrame],
          entryReason: entry.entryReason,
          exitReason: entry.exitReason,
          description: entry.description,
          pnl: entry.pnl,
          winlossdraw: entry.winlossdraw,
          image: entry.image,
        });
      }
    } catch (error) {
      console.error("Error fetching trade entries:", error);
    }
  };

  useEffect(() => {
    if (id != null) {
      handleEditEntry();
    }
  }, [id]);

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (id != null) {
      const tradeId: number = Number(id);
      setModal(false);
      try {
        console.log(formInput);
        const res = await axios.put(
          "http://localhost:3000/api/v1/stockRoute/update-stockEntry",
          {
            id: tradeId,
            contract: formInput.contract,
            entryTimeFrame: timeframes[formInput.entryTimeFrame],
            entryReason: formInput.entryReason,
            exitReason: formInput.exitReason,
            description: formInput.description,
            pnl: Number(formInput.pnl),
            winlossdraw: formInput.winlossdraw,
            image: formInput.image,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (res.status == 200) {
          console.log(res.data.msg);
        } else {
          console.log(res.data.msg);
        }
      } catch (error) {
        console.error("Error updating entry", error);
        throw error; // Re-throw the error to be handled by the caller
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/v1/stockRoute/add-stockEntry",
          {
            contract: formInput.contract,
            entryTimeFrame: timeframes[formInput.entryTimeFrame],
            entryReason: formInput.entryReason,
            exitReason: formInput.exitReason,
            description: formInput.description,
            pnl: Number(formInput.pnl),
            sl: 54745,
            winlossdraw: formInput.winlossdraw,
            image: formInput.image,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.status == 200) {
          console.log(res.data.data.msg);
          navigate("/");
        }
      } catch (error) {
        console.error("Error updating entry", error);
        throw error; // Re-throw the error to be handled by the caller
      }
    }
  };

  return (
    <div className="p-8 container">
      <form onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Entry
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please fill every entry carefully.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="contract"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Contract
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="contract"
                      id="contract"
                      autoComplete="contract"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="contract"
                      value={formInput.contract}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="bud">
                <label
                  htmlFor="entryTimeframe"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Time frame
                </label>
                <div className="lb">
                  <select
                    id="entryTimeframe"
                    name="entryTimeFrame"
                    autoComplete="entry-timeframe"
                    className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={formInput.entryTimeFrame}
                    onChange={handleChange}
                  >
                    {Object.keys(timeframes).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="entryReason"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Entry Reason
                </label>
                <div className="mt-2">
                  <textarea
                    id="entryReason"
                    name="entryReason"
                    value={formInput.entryReason}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a reason why you take the entry.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="exitReason"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Exit Reason
                </label>
                <div className="mt-2">
                  <textarea
                    id="exitReason"
                    name="exitReason"
                    value={formInput.exitReason}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a reason why you take the exit.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    value={formInput.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="pnl"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Profit and Loss
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="pnl"
                    id="pnl"
                    value={formInput.pnl}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="bud">
                <label
                  htmlFor="winLossDraw"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  WIN, LOSS or DRAW
                </label>
                <div className="lb">
                  <select
                    id="winLossDraw"
                    name="winlossdraw"
                    autoComplete="win-loss-draw"
                    className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={formInput.winlossdraw}
                    onChange={handleChange}
                  >
                    {winLossDrawOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Image
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="image"
                        id="image"
                        autoComplete="contract"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="contract"
                        value={formInput.image}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => {
              if (setModal) setModal(false);
              navigate("/");
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {Formtype === "EDIT" ? "Save Changes" : "Add Entry"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default Entryform;
