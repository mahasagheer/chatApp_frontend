//Import Libraries
import { Route, Routes } from "react-router";

// Import Pages
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
        <Route path="/sign_up" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
