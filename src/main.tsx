import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import AdminHistory from "./admin/AdminHistory";
import App from "./App";
import DeleteCode from "./delete-code";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/delete-code" element={<DeleteCode />} />
        <Route path="/admin" element={<AdminHistory />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
