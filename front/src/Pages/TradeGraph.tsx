import React from "react";
import Graph from "../Component/Graph";
import Sidebar from "./Sidebar";
import Navbar from "../Component/Navbar";

const TradeGraph = () => {
  return (
    <div className="bg-[#111827]">
      <Navbar />
      <div className="flex flex-row">
        <Graph />
        <Sidebar />
      </div>
    </div>
  );
};

export default TradeGraph;
