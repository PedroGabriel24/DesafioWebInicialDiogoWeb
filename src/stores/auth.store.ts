import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserRole, JwtPayload } from "@/api/types";
import { authService } from "@/api/services/auth.service";
import router from "@/router";

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const decoded = ref<JwtPayload | null>(
    token.value ? decodeJwt(token.value) : null,
  );

  const isAuthenticated = computed(() => !!token.value && !!decoded.value);
  const userName = computed(() => decoded.value?.payload?.name ?? "");
  const userRole = computed<UserRole | null>(() => {
    const p = decoded.value?.payload?.profile?.toUpperCase();
    if (p === "ADMIN" || p === "PROFESSOR" || p === "ALUNO")
      return p as UserRole;
    return null;
  });
  const userId = computed(() => Number(decoded.value?.payload?.userId) || 0);

  async function login(email: string, senha: string) {
    const jwt = await authService.login({ email, senha });
    token.value = jwt;
    localStorage.setItem("token", jwt);
    decoded.value = decodeJwt(jwt);

    const role = userRole.value;
    if (role === "ADMIN") router.push("/admin");
    else if (role === "PROFESSOR") router.push("/professor");
    else if (role === "ALUNO") router.push("/aluno");
    else router.push("/");
  }

  function logout() {
    token.value = null;
    decoded.value = null;
    localStorage.removeItem("token");
    router.push("/login");
  }

  return { token, decoded, isAuthenticated, userName, userRole, userId, login, logout };
});
