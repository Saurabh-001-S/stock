import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Edit from "./Pages/Edit";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/signin" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/edit-entry/:id" element={<Home />} />
          <Route exact path="/add-entry" element={<Edit />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
