import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { AxiosResponse } from "axios";
import { create } from "zustand";

interface Boards {
  id: string;
  title: string;
  user_id: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

type BoardsStore = {
  loading: boolean;
  error: string | null;
  boards: Boards[] | null;
  createBoard: () => Promise<AxiosResponse<any> | string>;
};

export const useBoardsStore = create<BoardsStore>((set) => ({
  boards: null,
  loading: false,
  error: null,

  async createBoard() {
    set({ loading: true, error: null });
    try {
      const res = await axiosClient.post(
        "/board",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        set((state) => ({
          boards: [...(state.boards || []), res.data],
          loading: false,
        }));
        return res;
      } else {
        set({ loading: false });
        return res;
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
}));
