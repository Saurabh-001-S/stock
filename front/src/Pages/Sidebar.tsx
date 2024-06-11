import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const cardH3: string = "font-sans text-gray-200 text-base";
  const cardP: string = "font-sans text-sm tracking-wide";
  const [stat, setStat] = useState({ FRX: {}, IND: {} });

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

  const card: string =
    "flex flex-col justify-between text-base font-normal text-gray-900 border px-4 py-2 my-4 border-gray-500 rounded-md ";
  return (
    <div className="h-lvh m-4 w-1/4">
      <div>
        <h2 className="font-momo text-blue-300 text-2xl">Statistics</h2>
      </div>
      {stat == null ? (
        <>
          <h3>Something went wrong. Please reload the page!</h3>
        </>
      ) : (
        <div>
          <div className={card}>
            <h3 className={`${cardH3} pb-2`}>IND</h3>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-between">
                <div className="pb-2">
                  <h3 className={cardH3}>Total PNL</h3>
                  <p className={`${cardP} text-white font`}>
                    {stat.IND.totalPnl}
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Max Prf.</h3>
                  <p className={`${cardP} text-green-500`}>
                    {stat.IND.maxProfit}
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Win %</h3>
                  <p className={`${cardP} text-green-500`}>
                    {stat.IND.winPercentage} %
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Total Prf</h3>
                  <p className={`${cardP} text-green-500`}>
                    {stat.IND.totalProfit}
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Brokerage</h3>
                  <p className={`${cardP} text-white`}>{stat.IND.brokerage}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="pb-2">
                  <h3 className={cardH3}>Win Ratio</h3>
                  <p className={`${cardP} text-white`}>{stat.IND.winRatio}</p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Max Loss</h3>
                  <p className={`${cardP} text-red-500`}>{stat.IND.minLoss}</p>
                </div>
                <div>
                  <h3 className={cardH3}>Loss %</h3>
                  <p className={`${cardP} text-red-500`}>
                    {stat.IND.lossPercentage} %
                  </p>
                </div>
                <div>
                  <h3 className={cardH3}>Total Loss</h3>
                  <p className={`${cardP} text-red-500`}>
                    {stat.IND.totalLoss}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={card}>
            <h3 className={`${cardH3} pb-2`}>FOREX</h3>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-between">
                <div className="pb-2">
                  <h3 className={cardH3}>Total PNL</h3>
                  <p className={`${cardP} text-white font`}>
                    {stat.FRX.totalPnl}
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Max Prf.</h3>
                  <p className={`${cardP} text-green-500`}>
                    {stat.FRX.maxProfit}
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Win %</h3>
                  <p className={`${cardP} text-green-500`}>
                    {stat.FRX.winPercentage} %
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Total Prf</h3>
                  <p className={`${cardP} text-green-500`}>
                    {stat.FRX.totalProfit}
                  </p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Brokerage</h3>
                  <p className={`${cardP} text-white`}>{stat.FRX.brokerage}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="pb-2">
                  <h3 className={cardH3}>Win Ratio</h3>
                  <p className={`${cardP} text-white`}>{stat.FRX.winRatio}</p>
                </div>
                <div className="pb-2">
                  <h3 className={cardH3}>Max Loss</h3>
                  <p className={`${cardP} text-red-500`}>{stat.FRX.minLoss}</p>
                </div>
                <div>
                  <h3 className={cardH3}>Loss %</h3>
                  <p className={`${cardP} text-red-500`}>
                    {stat.FRX.lossPercentage} %
                  </p>
                </div>
                <div>
                  <h3 className={cardH3}>Total Loss</h3>
                  <p className={`${cardP} text-red-500`}>
                    {stat.FRX.totalLoss}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
