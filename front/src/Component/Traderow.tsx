import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Trash } from "lucide-react";

const timeframe = {
  MIN1: "1 Min",
  MIN2: "2 Min",
  MIN5: "5 Min",
  HOUR1: "1 Hour",
};

const Traderow: React.FC<{
  filterQuery: {
    winlossdraw: string;
    region: string;
    startDate: string;
    endDate: string;
  };
}> = forwardRef(({ filterQuery }, ref) => {
  const [trade, setTrade] = useState([]);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState("Img");
  const [img, setImg] = useState("");

  const navigate = useNavigate();
  const rowClass =
    "px-2 py-2 text-balance font-mono font-thin text-xs border-b border-gray-500 h-5";

  const handleEdit = (id: number) => {
    setShow("Edit");
    setModal(true);
    navigate(`/edit-entry/${id}`);
  };

  const handleView = (url: string) => {
    setImg(url);
    setModal(true);
    setShow("Img");
  };

  const fetchEntries = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/stockRoute/get-allentry",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.status === 200) {
        const tradeEntries = res.data.data.map((data) => ({
          id: data.id,
          contract: data.contract,
          date: data.date,
          entryTimeFrame: data.entryTimeFrame,
          entryReason: data.entryReason,
          exitReason: data.exitReason,
          description: data.description,
          pnl: data.pnl,
          winlossdraw: data.winlossdraw,
          image: data.image,
          region: data.region,
        }));
        setTrade(tradeEntries);
      } else {
        console.error(`Unexpected response status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error fetching trade entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/v1/stockRoute/delete-stockEntry",
        {
          headers: {
            Authorization: `${token}`,
          },
          data: { id: id },
        }
      );
      if (res.status === 200) {
        fetchEntries();
      } else {
        console.error(`Unexpected response status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error fetching trade entries:", error);
    }
  };

  // Apply filters based on filterQuery prop
  const filteredTrade = trade.filter((item) => {
    if (filterQuery.winlossdraw && filterQuery.winlossdraw !== "Select") {
      if (item.winlossdraw !== filterQuery.winlossdraw) {
        return false;
      }
    }
    if (filterQuery.region && filterQuery.region !== "Select") {
      if (item.region !== filterQuery.region) {
        return false;
      }
    }
    if (filterQuery.startDate && filterQuery.startDate.trim() !== "") {
      const startDate = new Date(filterQuery.startDate);
      if (new Date(item.date) < startDate) {
        return false;
      }
    }
    if (filterQuery.endDate && filterQuery.endDate.trim() !== "") {
      const endDate = new Date(filterQuery.endDate);
      endDate.setHours(23, 59, 59); // Set end date to end of day
      if (new Date(item.date) > endDate) {
        return false;
      }
    }
    return true;
  });

  useImperativeHandle(ref, () => ({
    fetchEntries,
  }));

  return (
    <>
      <Modal URL={img} show={show} modal={modal} setModal={setModal} />
      <tbody>
        {filteredTrade.length === 0 ? (
          <tr>
            <td colSpan={13} className="text-center py-4">
              No entries found for selected filters.
            </td>
          </tr>
        ) : (
          filteredTrade.map((row, index) => (
            <tr key={row.id}>
              <td className={`${rowClass} text-white`}>{index + 1}</td>
              <td className={`${rowClass} text-white`}>{row.contract}</td>
              <td className={`${rowClass} text-white`}>
                {row.date.slice(0, 10)}
              </td>
              <td className={`${rowClass} text-white`}>
                {timeframe[row.entryTimeFrame]}
              </td>
              <td className={`${rowClass} description text-white`}>
                {row.entryReason}
              </td>
              <td className={`${rowClass} description text-white`}>
                {row.exitReason}
              </td>
              <td className={`${rowClass} description text-white`}>
                {row.description}
              </td>
              <td className={`text-white ${rowClass}`}>{row.pnl}</td>
              {row.winlossdraw === "WIN" && (
                <td className={`text-green-500 ${rowClass}`}>
                  {row.winlossdraw}
                </td>
              )}
              {row.winlossdraw === "LOSS" && (
                <td className={`text-red-500 ${rowClass}`}>
                  {row.winlossdraw}
                </td>
              )}
              {row.winlossdraw === "DRAW" && (
                <td className={`text-gray-200 ${rowClass}`}>
                  {row.winlossdraw}
                </td>
              )}
              <td className={`${rowClass} text-white`}>{row.region}</td>
              <td className={`${rowClass} text-center text-white`}>
                <button
                  className="text-white bg-blue-600 px-2 py-1 rounded-md"
                  onClick={() => handleView(row.image)}
                >
                  View
                </button>
              </td>
              <td className={`text-white ${rowClass}`}>
                <button
                  className="text-white bg-blue-600 px-2 py-1 rounded-md"
                  onClick={() => handleEdit(row.id)}
                >
                  Edit
                </button>
              </td>
              <td className={`text-white ${rowClass}`}>
                <button onClick={() => handleDelete(row.id)}>
                  <Trash color="#b42727" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </>
  );
});

export default Traderow;
