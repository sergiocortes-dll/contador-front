import { createBrowserRouter } from "react-router";
import Index from "./page";
import Layout from "./page/_layout";

const Routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Index />,
      },
    ],
  },
]);

export default Routes;
