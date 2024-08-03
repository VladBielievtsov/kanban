import axios from "axios";

// process.env.API_BASE_URL

export const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
});

export function handleAxiosErrorMessage(error: unknown) {
  let errorMessage = "An unknown error occurred";
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return errorMessage;
}
