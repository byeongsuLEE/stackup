import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Footer from "./components/common/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

const Home = () => {
  return <h1 className="text-3xl font-bold underline">StackUP</h1>;
};
