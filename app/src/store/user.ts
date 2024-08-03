import axios, { AxiosResponse } from "axios";
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
  logout: () => Promise<void>;
  setUser: () => Promise<void>;
  updateAvatar: (
    formData: FormData
  ) => Promise<AxiosResponse<any, any> | string>;
  editUser: (
    firstName: string,
    lastName: string
  ) => Promise<AxiosResponse<any, any> | string>;
};

export const useUserStore = create<UserStore>((set, get) => ({
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
      const errorMessage = handleAxiosErrorMessage(error);
      set({ user: null, loading: false, error: errorMessage });
    }
  },
  async setUser() {
    set({ loading: true, error: null });

    try {
      const res = await axios.get("http://localhost:4000/me", {
        withCredentials: true,
      });

      if (res.status === 200) {
        set({ user: res.data.user, loading: false, error: null });
      } else {
        set({
          loading: false,
          error: res.data.message || "Failed to get user",
        });
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      set({ loading: false, error: errorMessage });
    }
  },
  async logout() {
    set({ loading: true, error: null });

    try {
      const res = await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        set({ loading: false, user: null, error: null });
      } else {
        set({ loading: false, error: res.data.message || "Failed logout" });
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      set({ loading: false, error: errorMessage });
    }
  },
  async updateAvatar(formData) {
    try {
      const response = await axios.put(
        `http://localhost:4000/user/avatar`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (get().user) {
          set((state) => ({
            user: {
              ...state.user!,
              avatar_url: response.data.avatarURL,
            },
          }));
        }
        return response;
      } else {
        set({
          error: response.data.message || "failed to update avatar",
        });
        return response;
      }
    } catch (error: unknown) {
      const errorMessage = handleAxiosErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
  async editUser(firstName, lastName) {
    try {
      const response = await axios.put(
        "http://localhost:4000/user/edit",
        {
          first_name: firstName,
          last_name: lastName,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (get().user) {
          set((state) => ({
            user: {
              ...state.user!,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
            },
          }));
        }
        return response;
      } else {
        set({
          error: response.data.message || "failed to update user",
        });
        return response;
      }
    } catch (error: unknown) {
      const errorMessage = handleAxiosErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
}));

export function handleAxiosErrorMessage(error: unknown) {
  let errorMessage = "An unknown error occurred";
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return errorMessage;
}
