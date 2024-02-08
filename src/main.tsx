import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
/*Lib para utilizar alertas: */
import { Toaster } from "sonner";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors/>
  </React.StrictMode>
);
