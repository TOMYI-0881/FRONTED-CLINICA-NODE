import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClinicApp } from "./ClinicApp";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClinicApp />
  </StrictMode>,
);
