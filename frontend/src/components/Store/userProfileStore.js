import { create } from "zustand";
const useUserProfileStore = create((set) => ({
  userProfile: null,
  isLoading: false,

  setUserProfile: (userProfile) => set({ userProfile }),
}));

export default useUserProfileStore;
