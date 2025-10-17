// src/store/userStore.js
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // initialize from localStorage
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));
