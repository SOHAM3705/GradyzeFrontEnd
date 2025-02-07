import React from "react";
import { createRoot } from "react-dom/client"; // Correct import
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Create the root element using 'createRoot' from 'react-dom/client'
const root = createRoot(document.getElementById("root")); // Creating the root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
