import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { AxiosResponse } from "axios";
import { create } from "zustand";

interface Boards {
  id: string;
  title: string;
  user_id: string;
  description: string;
  icon: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

type BoardsStore = {
  loading: boolean;
  error: string | null;
  boards: Boards[] | null;
  createBoard: () => Promise<AxiosResponse<any> | string>;
  allBoards: () => Promise<AxiosResponse<any>>;
  deleteBoard: (id: string) => Promise<AxiosResponse<any>>;
  updateBoard: (
    id: string,
    title: string,
    description: string,
    icon: string
  ) => Promise<AxiosResponse<any>>;
  toggleFav: (id: string) => Promise<AxiosResponse<any>>;
};

export const useBoardsStore = create<BoardsStore>((set, get) => ({
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

  async allBoards() {
    try {
      const res = await axiosClient.get("/boards", { withCredentials: true });

      if (res.status === 200) {
        set({
          boards: res.data,
        });
        return res;
      } else {
        return res;
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  async deleteBoard(id) {
    try {
      const res = await axiosClient.delete("/board/" + id, {
        withCredentials: true,
      });

      if (res.status === 200) {
        set((state) => ({
          boards: state.boards?.filter((b) => b.id != id),
        }));
        return res;
      } else {
        return res;
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  async updateBoard(id, title, description, icon) {
    try {
      const res = await axiosClient.patch(
        "/board/" + id,
        {
          title,
          description,
          icon,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        set((state) => ({
          boards: state.boards?.map((board) =>
            board.id === id ? { ...board, title, description, icon } : board
          ),
        }));
        return res;
      } else {
        return res;
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  async toggleFav(id) {
    try {
      const res = await axiosClient.patch(
        `/board/${id}/favorite`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        set((state) => ({
          boards: state.boards?.map((board) =>
            board.id === id ? { ...board, favorite: res.data.favorite } : board
          ),
        }));
        return res;
      } else {
        return res;
      }
    } catch (error) {
      const errorMessage = handleAxiosErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
}));
