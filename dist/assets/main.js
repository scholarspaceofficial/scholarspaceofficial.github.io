import React from "react";
import { createRoot } from "react-dom/client";
import ScholarSpace from "./scholarspace.js";

createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null, React.createElement(ScholarSpace))
);
