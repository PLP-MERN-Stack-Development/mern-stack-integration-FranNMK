import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostList from "./pages/PostList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
