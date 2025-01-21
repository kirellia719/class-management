import "./App.scss";
import 'boxicons'

import { useEffect } from "react";
import { useQuery } from "react-query";

import usePostStore from "./store/postsStore";
import { getPosts } from "./api/postAPI";

import AuthLayout from "./layout/AuthLayout"
import { Route, Routes } from "react-router-dom";

// App.js

const App = () => {
   return (
      <div className="App">
         <Routes>
            <Route index path="/" element={<AuthLayout />} />
         </Routes>
      </div>
   );
};

export default App;
