import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import useAuthStore from "../Store/authStore";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const navigate = useNavigate();
  const { login, signup } = useAuthStore();
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const branches = [
    "CSE",
    "IT",
    "ANE",
    "ECE",
    "CS",
    "AI/ML",
    "DS",
    "MECH",
    "EEE",
  ];

  const getSections = (year) => {
    switch (year) {
      case "I":
        return Array.from(
          { length: 7 },
          (_, i) => `I-${String.fromCharCode(65 + i)}`
        );
      case "II":
        return Array.from(
          { length: 7 },
          (_, i) => `II-${String.fromCharCode(65 + i)}`
        );
      case "III":
        return Array.from(
          { length: 4 },
          (_, i) => `III-${String.fromCharCode(65 + i)}`
        );
      case "IV":
        return Array.from(
          { length: 2 },
          (_, i) => `IV-${String.fromCharCode(65 + i)}`
        );
      default:
        return [];
    }
  };

  const allSections = [
    ...getSections("I"),
    ...getSections("II"),
    ...getSections("III"),
    ...getSections("IV"),
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Successfully signed in",
        variant: "success",
      });
      navigate(`/home`);
    } catch (error) {
      toast({
        title: error.response?.data?.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    console.log(signupName, signupEmail, signupPassword, branch, section);
    if (!signupName || !signupEmail || !signupPassword || !branch || !section) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!emailRegex.test(signupEmail)) {
      toast({
        title: "Invalid email format",
        variant: "destructive",
      });
      return;
    }
    if (!passwordRegex.test(signupPassword)) {
      toast({
        title:
          "Password must be at least 8 characters long and contain both letters and numbers",
        variant: "destructive",
      });
      return;
    }

    if (!branch || !section) {
      toast({
        title: "Please select both branch and section",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await signup(
        signupName,
        signupEmail,
        signupPassword,
        branch,
        section
      );
      toast({
        title: response.message,
        variant: "success",
      });
      console.log(response);
      localStorage.setItem("tempEmail", signupEmail);
      navigate("/verify-otp");
    } catch (error) {
      toast({
        title: error.response?.data?.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img
              src="https://t4.ftcdn.net/jpg/01/74/69/15/360_F_174691572_8aZuo9aKGNp3FFCuAzq91uOwaY3VPrrN.jpg"
              alt="Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div className="flex mb-8">
            <button
              className={`flex-1 text-lg font-semibold py-2 ${
                activeTab === "login"
                  ? "text-sky-500 border-b-2 border-sky-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 text-lg font-semibold py-2 ${
                activeTab === "signup"
                  ? "text-sky-500 border-b-2 border-sky-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign up
            </button>
          </div>
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Log in
              </button>
              <div className="mt-4 text-center">
                <a href="/forgot-password" className="text-sky-500">
                  Forgot Password?
                </a>
              </div>
              <div className="mt-4 text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-sky-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="User Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select Section</option>
                {allSections.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Sign up
              </button>
              <div className="mt-4 text-center">
                <span className="text-gray-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-sky-500"
                >
                  Log in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
