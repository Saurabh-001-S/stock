import React, { useState, useEffect } from "react";
import axios from "axios";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Graph = () => {
  const [trade, setTrade] = useState([]);

  const fetchEntry = async () => {
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
          date: new Date(data.date), // Ensure date is correctly parsed
          entryTimeFrame: data.entryTimeFrame,
          entryReason: data.entryReason,
          exitReason: data.exitReason,
          description: data.description,
          pnl: data.pnl,
          winlossdraw: data.winlossdraw,
          brokerage: data.brokerage,
          region: data.region,
          image: data.image,
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
    fetchEntry();
  }, []);

  // Filter data based on region
  const indianData = trade.filter((entry) => entry.region === "IND");
  const forexData = trade.filter((entry) => entry.region === "FOREX");

  // Sort data points by date and ensure unique entries
  const sortData = (data) => {
    return data
      .map((entry) => {
        const netPnl =
          entry.winlossdraw === "WIN"
            ? entry.pnl - entry.brokerage
            : -entry.pnl - entry.brokerage;
        return {
          x: entry.date,
          y: netPnl,
          color: netPnl < 0 ? "red" : "green",
        };
      })
      .sort((a, b) => a.x - b.x);
  };

  const indianDataPoints = sortData(indianData);
  const forexDataPoints = sortData(forexData);

  const extendDateRange = (dataPoints) => {
    if (dataPoints.length === 0) return [new Date(), new Date()];
    const minDate = new Date(Math.min(...dataPoints.map((entry) => entry.x)));
    const maxDate = new Date(Math.max(...dataPoints.map((entry) => entry.x)));
    minDate.setDate(minDate.getDate() - 1); // Add one day before the first entry
    maxDate.setDate(maxDate.getDate() + 1); // Add one day after the last entry
    return [minDate, maxDate];
  };

  const [indianMinDate, indianMaxDate] = extendDateRange(indianDataPoints);
  const [forexMinDate, forexMaxDate] = extendDateRange(forexDataPoints);

  const commonOptions = {
    animationEnabled: true,
    axisX: {
      valueFormatString: "DD/MM",
      labelFormatter: (e) => {
        const date = new Date(e.value);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      },
      intervalType: "day",
    },
    axisY: {
      title: "PnL (in USD)",
      prefix: "$",
      includeZero: true,
    },
    data: [
      {
        yValueFormatString: "$#,###",
        xValueFormatString: "DD/MM",
        type: "spline",
        markerSize: 5,
      },
    ],
  };

  const indianOptions = {
    ...commonOptions,
    title: {
      text: "Indian Region Trade PnL Over Time",
    },
    axisY: {
      ...commonOptions.axisY,
      title: "PnL (in Rupees)",
      prefix: "₹",
    },
    axisX: {
      ...commonOptions.axisX,
      minimum: indianMinDate,
      maximum: indianMaxDate,
    },
    data: [
      {
        ...commonOptions.data[0],
        dataPoints: indianDataPoints,
      },
    ],
  };

  const forexOptions = {
    ...commonOptions,
    title: {
      text: "FOREX Region Trade PnL Over Time",
    },
    axisX: {
      ...commonOptions.axisX,
      minimum: forexMinDate,
      maximum: forexMaxDate,
    },
    data: [
      {
        ...commonOptions.data[0],
        dataPoints: forexDataPoints,
      },
    ],
  };

  return (
    <div className="w-3/4 h-dvh flex flex-col gap-4">
      <div>
        <CanvasJSChart options={indianOptions} />
      </div>
      <div>
        <CanvasJSChart options={forexOptions} />
      </div>
    </div>
  );
};

export default Graph;
