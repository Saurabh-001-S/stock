import React, { MouseEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Tooltip,
} from "chart.js";
import {
  Chart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";

ChartJS.register(LinearScale, CategoryScale, BarElement, Legend, Tooltip);

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Graph = () => {
  const [trade, setTrade] = useState([]);
  const fetchentry = async () => {
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
        console.log(res.data.data);
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
    fetchentry();
  }, []);

  // Transform trade data to chart data
  const labels = trade.map((entry) =>
    new Date(entry.date).toLocaleDateString()
  );
  const pnlData = trade.map((entry) =>
    entry.winlossdraw === "WIN" ? entry.pnl : -entry.pnl
  );

  const data = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "PNL",
        backgroundColor: (context) => {
          const index = context.dataIndex;
          return pnlData[index] > 0 ? "rgb(75, 192, 192)" : "rgb(255, 99, 132)";
        },
        data: pnlData,
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const printDatasetAtEvent = (dataset) => {
    if (!dataset.length) return;
    const datasetIndex = dataset[0].datasetIndex;
    console.log(data.datasets[datasetIndex].label);
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;
    const { datasetIndex, index } = element[0];
    console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
  };

  const printElementsAtEvent = (elements) => {
    if (!elements.length) return;
    console.log(elements.length);
  };

  const chartRef = useRef(null);

  const onClick = (event) => {
    const { current: chart } = chartRef;
    if (!chart) {
      return;
    }
    printDatasetAtEvent(getDatasetAtEvent(chart, event));
    printElementAtEvent(getElementAtEvent(chart, event));
    printElementsAtEvent(getElementsAtEvent(chart, event));
  };

  return (
    <div className="w-3/4">
      <Chart
        ref={chartRef}
        type="bar"
        onClick={onClick}
        options={options}
        data={data}
      />
    </div>
  );
};

export default Graph;
