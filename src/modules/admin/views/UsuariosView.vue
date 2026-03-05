<template>
  <div>
    <div class="page-banner">
      <h1>Gestão de Usuários</h1>
      <p>Cadastre, edite e gerencie os usuários da plataforma.</p>
    </div>

    <div class="actions-row mt-lg">
      <div class="form-input search-box">
        <span class="material-icons-outlined icon">search</span>
        <input v-model="search" placeholder="Buscar por nome ou email..." />
      </div>
      <router-link to="/admin/usuarios/criar" class="btn btn-primary">
        <span class="material-icons-outlined" style="font-size: 18px"
          >person_add</span
        >
        Novo Usuário
      </router-link>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando usuários..." />

    <div v-else class="mt-lg table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>NOME</th>
            <th>EMAIL</th>
            <th>TIPO</th>
            <th>STATUS</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="flex items-center gap-sm">
                <div class="avatar avatar-sm" :class="avatarColor(user.nome)">
                  {{ user.nome.charAt(0) }}
                </div>
                <span class="font-medium">{{ user.nome }}</span>
              </div>
            </td>
            <td class="text-secondary">{{ user.email }}</td>
            <td>
              <span class="badge" :class="tipoBadge(user.tipo)">{{
                user.tipo
              }}</span>
            </td>
            <td>
              <span
                class="badge"
                :class="
                  user.status === 'ATIVO' ? 'badge-success' : 'badge-danger'
                "
              >
                {{ user.status || "ATIVO" }}
              </span>
            </td>
            <td>
              <div class="flex gap-xs flex-wrap">
                <button
                  class="btn btn-sm"
                  :class="
                    user.status === 'ATIVO'
                      ? 'btn-outline-warn'
                      : 'btn-outline-ok'
                  "
                  @click="toggleStatus(user)"
                  :disabled="user._toggling"
                >
                  <span
                    v-if="user._toggling"
                    class="spinner"
                    style="width: 12px; height: 12px; border-width: 2px"
                  ></span>
                  <template v-else>
                    <span
                      class="material-icons-outlined"
                      style="font-size: 14px"
                    >
                      {{ user.status === "ATIVO" ? "block" : "check_circle" }}
                    </span>
                    {{ user.status === "ATIVO" ? "Inativar" : "Ativar" }}
                  </template>
                </button>
                <router-link
                  :to="`/admin/usuarios/${user.id}/editar`"
                  class="btn btn-outline btn-sm"
                >
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >edit</span
                  >
                </router-link>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteTarget = user"
                >
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >delete</span
                  >
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!filteredUsers.length" class="text-center text-secondary mt-md">
        Nenhum usuário encontrado.
      </p>
    </div>

    <div
      v-if="deleteTarget"
      class="modal-overlay"
      @click.self="deleteTarget = null"
    >
      <div class="modal-content" style="max-width: 400px">
        <div class="modal-header" style="background: var(--danger)">
          <h2>Confirmar Exclusão</h2>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        <div class="modal-body">
          <p>
            Tem certeza que deseja excluir
            <strong>{{ deleteTarget.nome }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="deleteTarget = null">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="confirmDelete">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { adminService } from "@/api/services/admin.service";
import { useToastStore } from "@/stores/toast.store";
import type { UsersResponse } from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loading = ref(true);
const search = ref("");
const users = ref<(UsersResponse & { _toggling?: boolean })[]>([]);
const deleteTarget = ref<UsersResponse | null>(null);

const filteredUsers = computed(() => {
  const s = search.value.toLowerCase();
  if (!s) return users.value;
  return users.value.filter(
    (u) =>
      u.nome.toLowerCase().includes(s) || u.email.toLowerCase().includes(s),
  );
});

const colors = [
  "avatar-blue",
  "avatar-green",
  "avatar-purple",
  "avatar-orange",
];
const avatarColor = (n: string) => colors[n.charCodeAt(0) % colors.length];
const tipoBadge = (t: string) => {
  const m: Record<string, string> = {
    ADMIN: "badge-danger",
    PROFESSOR: "badge-info",
    ALUNO: "badge-success",
  };
  return m[t?.toUpperCase()] ?? "badge-neutral";
};

async function toggleStatus(user: UsersResponse & { _toggling?: boolean }) {
  const newStatus = user.status === "ATIVO" ? "INATIVO" : "ATIVO";
  user._toggling = true;
  try {
    await adminService.atualizarUsuario(user.id, { status: newStatus });
    user.status = newStatus;
    toast.success(`${user.nome} agora está ${newStatus}`);
  } catch {
    toast.error("Erro ao alterar status");
  } finally {
    user._toggling = false;
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  try {
    await adminService.deletarUsuario(deleteTarget.value.id);
    users.value = users.value.filter((u) => u.id !== deleteTarget.value!.id);
    toast.success("Usuário excluído!");
  } catch {
    toast.error("Erro ao excluir usuário");
  }
  deleteTarget.value = null;
}

onMounted(async () => {
  try {
    users.value = await adminService.listarUsuarios();
  } catch {
    toast.error("Erro ao carregar usuários");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.search-box {
  max-width: 320px;
  flex: 1;
}
.btn-outline-warn {
  background: transparent;
  border: 1.5px solid var(--warning);
  color: var(--warning);
}
.btn-outline-warn:hover {
  background: #fef3c7;
}
.btn-outline-ok {
  background: transparent;
  border: 1.5px solid var(--success);
  color: var(--success);
}
.btn-outline-ok:hover {
  background: #dcfce7;
}

@media (max-width: 768px) {
  .actions-row {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    max-width: unset;
  }
}
</style>
