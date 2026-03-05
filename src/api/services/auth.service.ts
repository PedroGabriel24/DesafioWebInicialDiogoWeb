import api from "@/api/axios";
import type { AuthRequestParams } from "@/api/types";

export const authService = {
  async login(params: AuthRequestParams): Promise<string> {
    const { data } = await api.post<string>("/auth/login", params);
    return data;
  },
};
