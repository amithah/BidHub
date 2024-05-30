import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import { Login } from "./Login";

import AppLayout from "./ui/AppLayout";
import Home from "./Home";
import { AddItem } from "./AddItem";
import { ListItems } from "./ListItems";
import { ListAuctions } from "./ListAuctions";
import { Auction } from "./Auction";
import { Register } from "./Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/add-item",
        element: <AddItem />,
      },
      { path: "/items", element: <ListItems /> },

      { path: "/auctions", element: <ListAuctions /> },
      { path: "/auction/:id", element: <Auction /> },

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
