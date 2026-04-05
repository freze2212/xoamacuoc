import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import AdminHistory from "./admin/AdminHistory";
import DeleteCode from "./delete-code";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeleteCode />} />
        <Route path="/delete-code" element={<DeleteCode />} />
        <Route path="/admin" element={<AdminHistory />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
