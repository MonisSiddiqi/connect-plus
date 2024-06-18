import axios from "axios";
import { AUTH_TOKEN } from "@/utils/constants";
import { auth, AuthStatus, StorageKeys } from "@/utils/auth";
import { toast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/config";

const httpClient = axios.create({
  baseURL: BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(AUTH_TOKEN);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.headers.set("Accept", "application/json");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      return Promise.reject(error);
    }

    const loginStatus = localStorage.getItem(StorageKeys.status) as AuthStatus;

    if (response && response.status === 401 && loginStatus === "loggedIn") {
      return logoutAndRedirect();
    }

    const serverErr = response.data?.error;
    if (serverErr) {
      return Promise.reject(new Error(serverErr));
    }

    const errorMessage = response.data?.message;
    if (errorMessage) {
      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(response.data);
  }
);

const logoutAndRedirect = async () => {
  try {
    await auth.logout();
    window.location.href = "/";
  } catch (e) {
    if (e instanceof Error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    }
  }
};

export default httpClient;
