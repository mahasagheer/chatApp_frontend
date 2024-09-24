import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const SignUp = (e) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const Navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);
    axios
      .post("http://localhost:3030/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        Navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };
  return (
    <>
      <section className="bg-[url('./public/pexels-fauxels-3184401.jpg')] bg-center bg-cover w-full h-[100vh]  flex justify-center items-center">
        <div className="border border-black min-w-[25%] min-h-[25%]  py-8 backdrop-blur-lg rounded-2xl">
          <h1 className="text-4xl text-center pb-3 ">Sign up</h1>
          <p className="text-base text-center px-4 ">
            Create an account to connect with friends, share
            <br /> messages, and be a part of exciting conversations!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
            <input
              type="text"
              placeholder="Username"
              name="fullName"
              id="fullName"
              required
              onChange={(e) => setFullName(e.target.value)}
              className="p-3 rounded-full outline-none border border-black"
            />
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
            <input
              onChange={handleFileChange}
              type="file"
              name="profilePic"
              id="profilePic"
            />
            <button
              type="submit"
              className="p-3 rounded-full bg-black text-white"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;
