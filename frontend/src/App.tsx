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
import Footer from "./components/common/Footer";
import ChatIcon from "./icons/ChatIcon";
import ClientSignup from "./pages/ClientSignupPage";
import FreelancerSignup from "./pages/FreelancerSignupPage";
import FreelancerSkill from "./pages/FreelancerSkillPage";
import PostWork from "./pages/PostWorkPage";
import Signup from "./pages/SignupPage";
import WorkDetail from "./pages/WorkDetailPage";
import CandidateCheck from "./pages/CandidateCheckPage";
import Contract from "./pages/ContractPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App relative flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/post" element={<PostWork />} />
              <Route path="/work/detail" element={<WorkDetail />} />
              <Route path="/work/detail/candidate" element={<CandidateCheck />} />
              <Route path="/work/detail/contract" element={<Contract />} />
              <Route path="/project" element={<Project />} />
              <Route path="/career" element={<Career />} />
              <Route path="/account" element={<Account />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/client" element={<ClientSignup />} />
              <Route path="/signup/freelancer" element={<FreelancerSignup />} />
              <Route path="/signup/freelancer/skill" element={<FreelancerSkill />} />
            </Routes>
          </main>
          <Footer />
          <div className="fixed right-10 bottom-10">
            <ChatIcon />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
