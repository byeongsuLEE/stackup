import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/common/Navbar";
import Account from "./pages/AccountPage";
import Career from "./pages/CareerPage";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Mypage from "./pages/MyPage";
import Project from "./pages/ProjectPage";
import Work from "./pages/WorkPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/work" element={<Work />} />
          <Route path="/project" element={<Project />} />
          <Route path="/career" element={<Career />} />
          <Route path="/account" element={<Account />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


