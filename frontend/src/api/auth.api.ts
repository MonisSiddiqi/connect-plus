import httpClient from "@/api/http-client";
import { AUTH_TOKEN } from "@/utils/constants";
import { apiEndpoints } from "@/api/routes";

type LoginDto = {
  email: string;
  password: string;
};

type LoginResponse = {
  token_type: string;
  access_token: string;
};

export const loginApi = async (values: LoginDto): Promise<LoginResponse> => {
  const response = await httpClient.post(apiEndpoints.auth.login, {
    email: values.email,
    password: values.password,
  });
  return response.data.result;
};

//Register Api

type RegisterDto = {
  file: FileList;
  email: string;
  password: string;
  name: string;
  mobile: string;
};

type RegisterResponse = {
  token_type: string;
  access_token: string;
};

export const registerApi = async (
  values: RegisterDto
): Promise<RegisterResponse> => {
  const body = {
    file: values.file[0],
    email: values.email,
    password: values.password,
    name: values.name,
    mobile: values.mobile,
  };
  const response = await httpClient.post(apiEndpoints.auth.register, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.result;
};

export const logoutApi = () => {
  localStorage.removeItem(AUTH_TOKEN);
};
