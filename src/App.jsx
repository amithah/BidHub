import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import { Login } from "./Login";

import AppLayout from "./ui/AppLayout";
import  Home  from "./Home";
import { AddItem } from "./AddItem";
import { ListItems } from "./ListItems";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/add-item",
        element: <AddItem />,
      },
      { path: "/items", element: <ListItems /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
