import Navbar from "../Component/Navbar";
import StockList from "./StockList";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
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
    <div className="bg-[#111827]">
      <Navbar />
      <div className="flex flex-row">
        <StockList />
        <Sidebar />
      </div>
    </div>
  );
};

export default Home;
