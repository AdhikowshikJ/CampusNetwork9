import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import useAuthStore from "../Store/authStore";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const { toast } = useToast();
  const navigate = useNavigate();
  const email = localStorage.getItem("tempEmail");

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/verify-otp`,
        {
          email,
          otp: otpValue,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      toast({
        title: "Account verified successfully",
        variant: "success",
      });
      navigate("/home");
    } catch (error) {
      toast({
        title: error.response?.data?.error || "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/resend-otp`, {
        email,
      });
      setTimer(60);
      toast({
        title: "OTP resent successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: error.response?.data?.error || "Failed to resend OTP",
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

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Verify Your Email
          </h2>

          <p className="text-gray-400 text-center mb-8">
            Enter the verification code sent to your email
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between max-w-xs mx-auto">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !e.target.value &&
                      e.target.previousSibling
                    ) {
                      e.target.previousSibling.focus();
                    }
                  }}
                  className="w-12 h-12 text-center bg-gray-700 border border-gray-600 rounded-md text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Verify
            </button>

            <div className="text-center">
              <p className="text-gray-400">
                Didn't receive the code?{" "}
                {timer > 0 ? (
                  <span className="text-sky-500">Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={resendOTP}
                    className="text-sky-500 hover:text-sky-400"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
