import { useEffect, useState } from "react";
import api from "../services/api";

export default function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return posts;
}
