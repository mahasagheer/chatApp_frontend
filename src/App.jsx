//Import Libraries
import { Route, Routes } from "react-router";

// Import Pages
import Chat from "./pages/Chat";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
