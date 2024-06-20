import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Timeframe = {
  "1 min": "MIN1";
  "5 min": "MIN5";
  "15 min": "MIN15";
};
type WINLOSSDRAW = "WIN" | "LOSS" | "DRAW";
type REGION = "IND" | "FOREX";

const timeframes: Timeframe = {
  "1 min": "MIN1",
  "5 min": "MIN5",
  "15 min": "MIN15",
};
const Objecttimeframe = {
  MIN1: "1 min",
  MIN5: "5 min",
  MIN15: "15 min",
};
const winLossDrawOptions: WINLOSSDRAW[] = ["WIN", "LOSS", "DRAW"];
const Region: REGION[] = ["IND", "FOREX"];

interface FormProps {
  setModal?: React.Dispatch<React.SetStateAction<boolean>>;
  Formtype: string;
}

const Entryform: React.FC<FormProps> = memo(({ setModal, Formtype }) => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState("");
  const { id } = useParams<{ id: string }>(); // Correct usage of useParams

  // State to manage form input and initial form input
  const [formInput, setFormInput] = useState({
    contract: "",
    entryTimeFrame: "1 min",
    entryReason: "",
    exitReason: "",
    description: "",
    pnl: 0,
    winlossdraw: "DRAW",
    image: "",
    brokerage: 0,
    region: "",
  });

  const [initialFormInput, setInitialFormInput] = useState({
    contract: "",
    entryTimeFrame: "1 min",
    entryReason: "",
    exitReason: "",
    description: "",
    pnl: 0,
    winlossdraw: "DRAW",
    image: "",
    brokerage: 0,
    region: "",
  });

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormInput((prevState) => ({
  //     ...prevState,
  //     [name]: Number(value),
  //   }));
  // };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: name === "brokerage" || name === "pnl" ? Number(value) : value,
    }));
  };

  const handleImage = (e) => {
    const img = e.target.files?.[0];
    if (img) {
      setImageFile(img.name);
    }
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
        const initialData = {
          contract: entry.contract,
          entryTimeFrame: Objecttimeframe[entry.entryTimeFrame],
          entryReason: entry.entryReason,
          exitReason: entry.exitReason,
          description: entry.description,
          pnl: entry.pnl,
          winlossdraw: entry.winlossdraw,
          region: entry.region,
          brokerage: entry.brokerage,
          image: entry.image,
        };
        setFormInput(initialData);
        setInitialFormInput(initialData); // Set initial form input
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

  // const handleForm = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     console.error("No token found in localStorage.");
  //     return;
  //   }

  //   if (id != null) {
  //     const tradeId: number = Number(id);
  //     setModal(false);
  //     try {
  //       const updatedFields: any = {};

  //       // Track updated fields
  //       Object.keys(formInput).forEach((key) => {
  //         if (formInput[key] !== initialFormInput[key]) {
  //           updatedFields[key] = formInput[key];
  //         }
  //       });

  //       if (imageFile) {
  //         updatedFields.image = `${imageFile}`;
  //       }

  //       // Special handling for specific fields
  //       if (updatedFields.entryTimeFrame) {
  //         updatedFields.entryTimeFrame = timeframes[formInput.entryTimeFrame];
  //       }

  //       const res = await axios.put(
  //         "http://localhost:3000/api/v1/stockRoute/update-stockEntry",
  //         {
  //           id: tradeId,
  //           ...updatedFields,
  //         },
  //         {
  //           headers: {
  //             Authorization: `${token}`,
  //           },
  //         }
  //       );

  //       if (res.status == 200) {
  //         console.log(res.data.msg);
  //       }
  //     } catch (error) {
  //       console.error("Error updating entry", error);
  //       throw error; // Re-throw the error to be handled by the caller
  //     }
  //   }
  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    if (id != null) {
      const tradeId: number = Number(id);
      setModal(false);
      try {
        const updatedFields: any = {};

        // Track updated fields
        Object.keys(formInput).forEach((key) => {
          if (formInput[key] !== initialFormInput[key]) {
            updatedFields[key] = formInput[key];
          }
        });

        // Ensure createdAt is not included
        if (updatedFields.createdAt) {
          delete updatedFields.createdAt;
        }

        if (imageFile) {
          updatedFields.image = `${imageFile}`;
        }

        // Special handling for specific fields
        if (updatedFields.entryTimeFrame) {
          updatedFields.entryTimeFrame = timeframes[formInput.entryTimeFrame];
        }

        const res = await axios.put(
          "http://localhost:3000/api/v1/stockRoute/update-stockEntry",
          {
            id: tradeId,
            ...updatedFields,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.status == 200) {
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
            winlossdraw: formInput.winlossdraw,
            region: formInput.region,
            brokerage: Number(formInput.brokerage),
            image: `${imageFile}`,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.status == 200) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error adding entry", error);
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

              <div className="sm:col-span-3">
                <label
                  htmlFor="brokerage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brokerage
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="brokerage"
                    id="brokerage"
                    value={formInput.brokerage}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="bud">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Region
                </label>
                <div className="lb">
                  <select
                    id="region"
                    name="region"
                    autoComplete="IND-FOREX"
                    className="block flex-1 border-2 bg-transparent py-1.5 pl-1 border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={formInput.region}
                    onChange={handleChange}
                  >
                    {Region.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          // value={formInput.image}
                          onChange={handleImage}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG up to 10MB
                    </p>
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
