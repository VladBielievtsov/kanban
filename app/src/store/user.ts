import axios from "axios";
import { create } from "zustand";

interface IUser {
  id: string;
  password: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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
      const response = await axios.post(
        "http://localhost:4000/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const user: IUser = response.data.user;
        set({ user, loading: false, error: null });
      } else {
        set({
          user: null,
          loading: false,
          error: response.data.message || "Login failed",
        });
      }
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
