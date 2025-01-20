import "./App.scss";

import axios from "axios";
import { useQuery } from "react-query";

const fetchPosts = async () => {
   const res = await axios.get("https://jsonplaceholder.typicode.com/posts/");
   return res.data;
};

// App.js

const App = () => {
   const { isLoading, error, data: posts } = useQuery("posts", fetchPosts);
   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error.message}</div>;
   }
   return (
      <div className="App">
         <div className="div">
            {/* <h1>Posts</h1> */}
            <ul>
               {posts.map((post) => (
                  <li key={post.id}>{post.title}</li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default App;
