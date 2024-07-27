import axios from "axios";
import { create } from "zustand";

interface IUser {
  id: string;
  password: string;
  avatarurl: string;
  firstname: string;
  lastname: string;
  email: string;
  createdat: string;
  updatedat: string;
}

type UserStore = {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  async login(email, password) {
    set({ loading: true, error: null });

    try {
      const response = await axios.post("/api/login", { email, password });
      const user: IUser = response.data;

      set({ user, loading: false, error: null });
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ user: null, loading: false, error: errorMessage });
    }
  },
}));
