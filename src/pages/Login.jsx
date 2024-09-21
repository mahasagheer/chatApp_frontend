import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3030/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        const userData = res.data.data;
        const token = res.data.token;
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: token,
            data: userData,
          })
        );
        Navigate("/");
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <section className="bg-[url('./public/pexels-fauxels-3184401.jpg')] bg-center bg-cover w-full h-[100vh]  flex justify-center items-center">
        <div className="border border-black min-w-[25%] min-h-[25%]  py-8 backdrop-blur-lg rounded-2xl">
          <h1 className="text-4xl text-center pb-3 ">Login</h1>
          <p className="text-xl text-center ">Have an account?</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
            <input
              type="email"
              placeholder="example@gmail.com"
              name="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-full outline-none border border-black"
            />
            <input
              type="password"
              name="password"
              required
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-full outline-none border border-black"
            />
            <button
              type="submit"
              className="p-3 rounded-full bg-black text-white"
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
