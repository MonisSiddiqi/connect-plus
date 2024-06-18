import { queryClient } from "@/main";
import { AuthUser } from "@/api/user.api";

export enum StorageKeys {
  status = "STATUS",
}

export const auth: Auth = {
  status: "loggedOut",
  user: null,
  login: () => {
    const status = "loggedIn";
    localStorage.setItem(StorageKeys.status, status);
    auth.status = status;
  },
  logout: async () => {
    localStorage.clear();
    queryClient.removeQueries();
    queryClient.clear();
    auth.status = "loggedOut";
  },
};

export type Auth = {
  login: () => void;
  logout: () => Promise<void>;
  status: AuthStatus;
  user: AuthUser | null;
};

export type AuthStatus = "loggedOut" | "loggedIn";
