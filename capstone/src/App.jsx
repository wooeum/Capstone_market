import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import List from "./pages/List";
import Pay from "./pages/Pay";
import NewPerson from "./pages/NewPerson";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="list" element={<List />} />
      <Route path="pay" element={<Pay />} />
      <Route path="new-person" element={<NewPerson />} />
      {/* 404 */}
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
};

export default App;
