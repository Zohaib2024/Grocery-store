"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (formData.email === "admin" && formData.password === "admin123") {
      router.push("/studio");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="py-10 px-20 mb-10 border-2 space-y-4 rounded-3xl">
          <div className="text-center text-5xl font-bold text-green-700">
            Log in
          </div>
          <div>
            <Image
              src="/glogo.jpg"
              width={500}
              height={500}
              alt="Logo"
              className="mb-6 w-24 md:w-80"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h1 className="font-bold text-green-800">Email:</h1>
              <input
                type="text"
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                className="border-2 w-full rounded-lg h-10 p-2"
              />
            </div>
            <div className="space-y-2">
              <h1 className="font-bold text-green-800">Password:</h1>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border-2 w-full rounded-lg h-10 p-2"
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-500 text-xl text-white w-full rounded-md py-3"
            >
              Log in
            </button>
          </form>
        </div>
        <p>
          Create new account? <span className="text-blue-700">Sign in</span>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
