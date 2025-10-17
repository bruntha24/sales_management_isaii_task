import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // ✅ App.jsx with default export
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
