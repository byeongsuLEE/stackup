import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SimplePopup from "./components/common/ChatPopup";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import AccountDetail from "./pages/AccountDetailPage";
import Account from "./pages/AccountPage";
import CandidateCheck from "./pages/CandidateCheckPage";
import CareerDetail from "./pages/CareerDetailPage";
import Career from "./pages/CareerPage";
import CareerRegister from "./pages/CareerRegisterPage";
import ClientSignup from "./pages/ClientSignupPage";
import Contract from "./pages/ContractPage";
import FinalEvaluate from "./pages/FinalEvaluatePage";
import FreelancerSignup from "./pages/FreelancerSignupPage";
import FreelancerSkill from "./pages/FreelancerSkillPage";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import MitermEvaluate from "./pages/MitermEvaluatePage";
import Mypage from "./pages/MyPage";
import PostWork from "./pages/PostWorkPage";
import ProjectDetail from "./pages/ProjectDetailPage";
import Project from "./pages/ProjectPage";
import Signup from "./pages/SignupPage";
import Transfer from "./pages/TransferPage";
import WorkDetail from "./pages/WorkDetailPage";
import Work from "./pages/WorkPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className=" relative flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-10 mx-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/post" element={<PostWork />} />
              <Route path="/work/detail" element={<WorkDetail />} />
              <Route path="/work/detail/candidate" element={<CandidateCheck />} />
              <Route path="/work/detail/contract" element={<Contract />} />
              <Route path="/project" element={<Project />} />
              <Route path="/project/detail" element={<ProjectDetail />} />
              <Route path="/career" element={<Career />} />
              <Route path="/career/detail" element={<CareerDetail />} />
              <Route path="/career/register" element={<CareerRegister />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/detail" element={<AccountDetail />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/client" element={<ClientSignup />} />
              <Route path="/signup/freelancer" element={<FreelancerSignup />} />
              <Route path="/signup/freelancer/skill" element={<FreelancerSkill />} />
              <Route path="/evaluate/miterm" element={<MitermEvaluate />} />
              <Route path="/evaluate/final" element={<FinalEvaluate />} />
              <Route path="/transfer" element={<Transfer />} />
            </Routes>
          </main>
          <Footer />
          <div className="fixed right-7 bottom-7">
            <SimplePopup />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
