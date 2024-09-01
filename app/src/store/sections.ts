import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";
import { AxiosResponse } from "axios";
import { create } from "zustand";

interface Sections {
  id: string;
  title: string;
  user_id: string;
  board_id: string;
  createdAt: string;
  updatedAt: string;
}

type SectionsStore = {
  sections: Sections[] | null;
  createSections: (boardID: string) => Promise<AxiosResponse<any> | string>;
};

export const useSectionsStore = create<SectionsStore>((set) => ({
  sections: null,

  async createSections(boardID) {
    try {
      const res = await axiosClient.post(
        "/section/" + boardID,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        set((state) => ({
          sections: [...(state.sections || []), res.data],
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
