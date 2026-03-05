import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import LoginView from "@/views/LoginView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  { path: "/", redirect: "/login" },
  {
    path: "/admin",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { requiresAuth: true, role: "ADMIN" },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("@/modules/admin/views/DashboardView.vue"),
      },
      {
        path: "usuarios",
        name: "AdminUsuarios",
        component: () => import("@/modules/admin/views/UsuariosView.vue"),
      },
      {
        path: "usuarios/criar",
        name: "AdminUsuarioCriar",
        component: () => import("@/modules/admin/views/UsuarioFormView.vue"),
      },
      {
        path: "usuarios/:id/editar",
        name: "AdminUsuarioEditar",
        component: () => import("@/modules/admin/views/UsuarioFormView.vue"),
        props: true,
      },
      {
        path: "professor-serie",
        name: "AdminProfessorSerie",
        component: () => import("@/modules/admin/views/ProfessorSerieView.vue"),
      },
      {
        path: "aluno-serie",
        name: "AdminAlunoSerie",
        component: () => import("@/modules/admin/views/AlunoSerieView.vue"),
      },
      {
        path: "materias",
        name: "AdminMaterias",
        component: () => import("@/modules/admin/views/MateriasCrudView.vue"),
      },
      {
        path: "series",
        name: "AdminSeries",
        component: () => import("@/modules/admin/views/SeriesCrudView.vue"),
      },
      {
        path: "materia-serie",
        name: "AdminMateriaSerie",
        component: () => import("@/modules/admin/views/MateriaSerieView.vue"),
      },
    ],
  },
  {
    path: "/professor",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { requiresAuth: true, role: "PROFESSOR" },
    children: [
      {
        path: "",
        name: "ProfessorDashboard",
        component: () => import("@/modules/professor/views/DashboardView.vue"),
      },
      {
        path: "lancar-notas",
        name: "ProfessorLancarNotas",
        component: () =>
          import("@/modules/professor/views/LancarNotasView.vue"),
      },
      {
        path: "observacoes",
        name: "ProfessorObservacoes",
        component: () =>
          import("@/modules/professor/views/ObservacoesView.vue"),
      },
    ],
  },
  {
    path: "/aluno",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { requiresAuth: true, role: "ALUNO" },
    children: [
      {
        path: "",
        name: "AlunoDashboard",
        component: () => import("@/modules/aluno/views/MateriasView.vue"),
      },
      {
        path: "boletim",
        name: "AlunoBoletim",
        component: () => import("@/modules/aluno/views/BoletimView.vue"),
      },
      {
        path: "observacoes",
        name: "AlunoObservacoes",
        component: () => import("@/modules/aluno/views/ObservacoesView.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return next("/login");

  if (to.meta.role && authStore.userRole !== to.meta.role) {
    const role = authStore.userRole;
    if (role === "ADMIN") return next("/admin");
    if (role === "PROFESSOR") return next("/professor");
    if (role === "ALUNO") return next("/aluno");
    return next("/login");
  }

  if (to.path === "/login" && authStore.isAuthenticated) {
    const role = authStore.userRole;
    if (role === "ADMIN") return next("/admin");
    if (role === "PROFESSOR") return next("/professor");
    if (role === "ALUNO") return next("/aluno");
  }

  next();
});

export default router;
