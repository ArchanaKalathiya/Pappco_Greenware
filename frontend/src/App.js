import {BrowserRouter, Route, Routes, } from "react-router-dom"
import Home from "./pages/Home/Home";
import Login from "./pages/Home/auth/Login";
import Register from "./pages/Home/auth/Signup";
import Forgot from "./pages/Home/auth/Forgot";
import Reset from "./pages/Home/auth/Reset";
import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<Forgot />} />
        <Route path="/resetPassword/:resetToken" element={<Reset />} />

        <Route path="/dashboard" element={ 
          <Sidebar>
            <Layout>
                <Dashboard/>
            </Layout>
          </Sidebar>
        }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
