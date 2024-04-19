import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "contexts/GlobalContext";
import { TasksProvider } from "contexts/TasksContext";
import "./index.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider>
  <TasksProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </TasksProvider>
  </ContextProvider>
);
