import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  username: localStorage.getItem("username"),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signin`,
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      console.log(user);
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      // Example: After successful login
      localStorage.setItem("currentUserId", response.data._id);

      set({ user, token, isLoading: false });
    } catch (error) {
      console.error("Login error:", error);
      set({ user: null, token: null, isLoading: false });
      throw error;
    }
  },
  signup: async (username, email, password, branch, section) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signup`,
        {
          username,
          email,
          password,
          branch,
          section,
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      set({ isLoading: false });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("username");
    set({ user: null, token: null });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("username");
    set({ user: null, token: null });
  },
  fetchUserInfo: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token); // Log the token

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/getUserByToken`,
        {
          headers: { Authorization: token },
        }
      );

      set({ user: response.data, isLoading: false });
    } catch (error) {
      console.error("Fetch user info error:", error);
      set({ user: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
