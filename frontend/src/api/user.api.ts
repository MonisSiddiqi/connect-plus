import { apiEndpoints } from "@/api/routes";
import httpClient from "@/api/http-client";
import { UserRole } from "@/api/routes/types";

/* Get My profile Api*/
export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  updatedAt: string;
  createdAt: string;
  UserProfile: {
    id: string;
    userId: string;
    name: string;
    profilePhoto: string;
    updatedAt: string;
    createdAt: string;
  };
};

export const getMyProfileApi = async (): Promise<AuthUser> => {
  const response = await httpClient.get(apiEndpoints.user.me);
  return response.data.result;
};
