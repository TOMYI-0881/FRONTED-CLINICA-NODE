import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TomyiShopApp } from "./TomyiShopApp";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TomyiShopApp />
  </StrictMode>,
);
