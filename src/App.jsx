import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
const queryClient = new QueryClient();

// App.js
const router = createBrowserRouter([
   {
      path: "/auth",
      element: <AuthLayout />,
   },
   {
      path: "/*",
      element: <MainLayout />,
   },
   // {
   //    path: "/*",
   //    element: <Notfound />,
   // },
]);

const App = () => {
   return (
      <div className="App">
         <QueryClientProvider client={queryClient}>
            <ToastContainer />
            <RouterProvider
               router={router}
               future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
               }}
            />
         </QueryClientProvider>
      </div>
   );
};

export default App;
