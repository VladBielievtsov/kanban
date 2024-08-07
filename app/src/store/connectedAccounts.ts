import { AxiosResponse } from "axios";
import { create } from "zustand";
import { axiosClient, handleAxiosErrorMessage } from "@/lib/axios-client";

interface ConnectedAccounts {
  id: string;
  user_name: number;
  provider: string;
}

type ConnectedAccountsStore = {
  loading: boolean;
  error: string | null;
  connectedAccounts: ConnectedAccounts[] | null;
  getAccounts: () => Promise<AxiosResponse<any, any> | string>;
  unlinkAccount: (
    provider: string
  ) => Promise<AxiosResponse<any, any> | string>;
};

export const useConnectedAccountsStore = create<ConnectedAccountsStore>(
  (set) => ({
    connectedAccounts: null,
    loading: true,
    error: null,
    async getAccounts() {
      set({ loading: true, error: null });

      try {
        const response = await axiosClient.get("/user/accounts", {
          withCredentials: true,
        });

        if (response.status === 200) {
          set({
            connectedAccounts: response.data,
            loading: false,
            error: null,
          });
          return response;
        } else {
          set({
            loading: false,
            error: response.data.message || "Failed to get accounts",
          });
          return response;
        }
      } catch (error: unknown) {
        const errorMessage = handleAxiosErrorMessage(error);
        set({ loading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    },
    async unlinkAccount(provider) {
      set({ error: null });
      try {
        const response = await axiosClient.delete(
          `/user/accounts/${provider}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          set({
            connectedAccounts: null,
            error: null,
          });
          return response;
        } else {
          set({
            error: response.data.message || "Failed to unlink account",
          });
          return response;
        }
      } catch (error: unknown) {
        const errorMessage = handleAxiosErrorMessage(error);
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
    },
  })
);
