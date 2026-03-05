<template>
  <div class="app-layout">
    <button class="hamburger" @click="sidebarOpen = !sidebarOpen">
      <span class="material-icons-outlined">{{
        sidebarOpen ? "close" : "menu"
      }}</span>
    </button>
    <div
      class="sidebar-backdrop"
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
    ></div>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-top">
        <div class="sidebar-logo">
          <img src="../assets/logo.svg" alt="Logo" width="50px" />
          <span class="logo-text">Instituto J&F</span>
        </div>

        <div class="sidebar-user">
          <div class="avatar avatar-blue">{{ userInitial }}</div>
          <div>
            <p class="user-name">{{ authStore.userName }}</p>
            <p class="user-role">{{ roleLabel }}</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActiveRoute(item.to) }"
            @click="sidebarOpen = false"
          >
            <span class="material-icons-outlined nav-icon">{{
              item.icon
            }}</span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </div>

      <button class="nav-item logout-btn" @click="authStore.logout()">
        <span class="material-icons-outlined nav-icon">logout</span>
        <span>Sair</span>
      </button>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
const route = useRoute();
const sidebarOpen = ref(false);

const userInitial = computed(() => authStore.userName.charAt(0).toUpperCase());

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    ADMIN: "Administrador(a)",
    PROFESSOR: "Professor(a)",
    ALUNO: "Aluno(a)",
  };
  return map[authStore.userRole ?? ""] ?? "";
});

const navItems = computed(() => {
  const map: Record<string, { label: string; icon: string; to: string }[]> = {
    ADMIN: [
      { label: "Dashboard", icon: "dashboard", to: "/admin" },
      { label: "Usuários", icon: "people", to: "/admin/usuarios" },
      { label: "Matérias", icon: "menu_book", to: "/admin/materias" },
      { label: "Séries", icon: "class", to: "/admin/series" },
      {
        label: "Matéria → Série",
        icon: "mediation",
        to: "/admin/materia-serie",
      },
      { label: "Prof. → Série", icon: "school", to: "/admin/professor-serie" },
      { label: "Aluno → Série", icon: "person_add", to: "/admin/aluno-serie" },
    ],
    PROFESSOR: [
      { label: "Visão Geral", icon: "dashboard", to: "/professor" },
      {
        label: "Observações",
        icon: "description",
        to: "/professor/observacoes",
      },
      {
        label: "Lançar Notas",
        icon: "edit_note",
        to: "/professor/lancar-notas",
      },
    ],
    ALUNO: [
      { label: "Visão Geral", icon: "dashboard", to: "/aluno" },
      { label: "Observações", icon: "description", to: "/aluno/observacoes" },
      { label: "Boletim", icon: "assessment", to: "/aluno/boletim" },
    ],
  };
  return map[authStore.userRole ?? ""] ?? [];
});

function isActiveRoute(path: string) {
  if (["/admin", "/professor", "/aluno"].includes(path))
    return route.path === path;
  return route.path.startsWith(path);
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  background: linear-gradient(
    180deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  overflow-y: auto;
}
.sidebar-top {
  display: flex;
  flex-direction: column;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
}
.logo-text {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.3px;
}
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
}
.user-name {
  font-weight: 600;
  font-size: 13px;
}
.user-role {
  font-size: 11px;
  opacity: 0.7;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}
.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}
.nav-item.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
  border-left: 3px solid #fff;
  font-weight: 600;
}
.nav-icon {
  font-size: 20px;
}
.logout-btn {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: auto;
  padding: 16px 20px;
  color: rgba(255, 255, 255, 0.8);
}
.logout-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  background: var(--bg-gray);
}

.hamburger {
  display: none;
}
.sidebar-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 1100;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1050;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1040;
  }
  .main-content {
    padding: 60px 16px 16px;
  }
}
</style>
