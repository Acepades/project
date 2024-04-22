import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "controllers/GlobalContext";
import { TasksProvider } from "controllers/TasksContext";
import { PointsProvider } from './views/admin/default/components/PointsContext';

import "./index.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider>
  <TasksProvider>
  <PointsProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </PointsProvider>
  </TasksProvider>
  </ContextProvider>
);
