import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const card: string =
    "flex justify-between text-base font-medium text-gray-900 border p-4 my-4 border-gray-500 rounded-md";

  const cardH3: string = "font-sans text-gray-200 text-base";
  const cardP: string = "font-sans text-sm tracking-wide";
  const [stat, setStat] = useState(null);

  const getStatistics = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/stockRoute/statistics",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res.status == 200) {
        // console.log(res.data.data);
        setStat(res.data.data);
      }
    } catch (error) {
      console.error("Error updating entry", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <div className="w-1/4 h-lvh  m-4">
      <div>
        <h2 className="font-momo text-blue-300 text-2xl">Statistics</h2>
      </div>
      {stat == null ? (
        ""
      ) : (
        <div>
          <div className={card}>
            <h3 className={cardH3}>Total P&L</h3>
            {stat.avgPnl < 0 ? (
              <p className={`${cardP} text-red-500`}>{stat.avgPnl}</p>
            ) : (
              <p className={`${cardP} text-green-400`}>{stat.avgPnl}</p>
            )}
          </div>
          <div className={card}>
            <h3 className={cardH3}>Maximum Profit</h3>
            <p className={`${cardP} text-green-400`}>{stat.maxProfit}</p>
          </div>
          <div className={card}>
            <h3 className={cardH3}>Minimum Loss</h3>
            <p className={`${cardP} text-red-500`}>{stat.minloss}</p>
          </div>
          <div className={card}>
            <h3 className={cardH3}>Win Percentage</h3>
            <p className={`${cardP} text-green-400`}>{stat.winPercentage}%</p>
          </div>
          <div className={card}>
            <h3 className={cardH3}>Loss Percentage</h3>
            <p className={`${cardP} text-red-500`}>{stat.lossPercentage}%</p>
          </div>
          <div className={card}>
            <h3 className={cardH3}>Win Ratio</h3>
            <p className={`${cardP} text-gray-300`}>{stat.winRatio}</p>
          </div>
          <div className={card}>
            <h3 className={cardH3}>Total Profit</h3>
            <p className={`${cardP} text-green-500`}>{stat.totalProfit}</p>
          </div>
          <div className={card}>
            <h3 className={cardH3}>Total Loss</h3>
            <p className={`${cardP} text-red-500`}>{stat.totalLoss}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
