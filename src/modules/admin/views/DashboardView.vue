<template>
  <div>
    <div class="page-banner">
      <h1>Painel Administrativo</h1>
      <p>Gerencie usuários, séries e vínculos da plataforma.</p>
    </div>

    <div class="stats-row mt-lg">
      <StatsCard
        label="TOTAL DE USUÁRIOS"
        :value="totalUsers"
        sub="Cadastrados na plataforma"
      />
      <StatsCard
        label="PROFESSORES"
        :value="totalProfessores"
        sub="Ativos"
        color="var(--success)"
      />
      <StatsCard
        label="ALUNOS"
        :value="totalAlunos"
        sub="Matriculados"
        color="var(--info)"
      />
    </div>

    <div class="mt-lg">
      <h3 class="section-title">Ações rápidas</h3>
      <div class="actions-grid">
        <router-link to="/admin/usuarios" class="action-card card">
          <div class="card-body flex items-center gap-md">
            <span class="material-icons-outlined action-icon">people</span>
            <div>
              <p class="font-semibold">Gerenciar Usuários</p>
              <p class="text-sm text-secondary">
                Listar, criar, editar e deletar
              </p>
            </div>
          </div>
        </router-link>

        <router-link to="/admin/materias" class="action-card card">
          <div class="card-body flex items-center gap-md">
            <span class="material-icons-outlined action-icon">menu_book</span>
            <div>
              <p class="font-semibold">Gerenciar Matérias</p>
              <p class="text-sm text-secondary">Cadastro de disciplinas</p>
            </div>
          </div>
        </router-link>

        <router-link to="/admin/series" class="action-card card">
          <div class="card-body flex items-center gap-md">
            <span class="material-icons-outlined action-icon">class</span>
            <div>
              <p class="font-semibold">Gerenciar Séries</p>
              <p class="text-sm text-secondary">Cadastro de turmas/séries</p>
            </div>
          </div>
        </router-link>

        <router-link to="/admin/materia-serie" class="action-card card">
          <div class="card-body flex items-center gap-md">
            <span class="material-icons-outlined action-icon">mediation</span>
            <div>
              <p class="font-semibold">Matéria → Série</p>
              <p class="text-sm text-secondary">Vincular matéria em série</p>
            </div>
          </div>
        </router-link>

        <router-link to="/admin/professor-serie" class="action-card card">
          <div class="card-body flex items-center gap-md">
            <span class="material-icons-outlined action-icon">school</span>
            <div>
              <p class="font-semibold">Professor → Série</p>
              <p class="text-sm text-secondary">
                Vincular professor a matéria/série
              </p>
            </div>
          </div>
        </router-link>
        <router-link to="/admin/aluno-serie" class="action-card card">
          <div class="card-body flex items-center gap-md">
            <span class="material-icons-outlined action-icon">person_add</span>
            <div>
              <p class="font-semibold">Aluno → Série</p>
              <p class="text-sm text-secondary">Vincular aluno a série</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { adminService } from "@/api/services/admin.service";
import { useToastStore } from "@/stores/toast.store";
import StatsCard from "@/components/StatsCard.vue";

const toast = useToastStore();
const totalUsers = ref(0);
const totalProfessores = ref(0);
const totalAlunos = ref(0);

onMounted(async () => {
  try {
    const users = await adminService.listarUsuarios();
    totalUsers.value = users.length;
    totalProfessores.value = users.filter(
      (u) => u.tipo?.toUpperCase() === "PROFESSOR",
    ).length;
    totalAlunos.value = users.filter(
      (u) => u.tipo?.toUpperCase() === "ALUNO",
    ).length;
  } catch {
    toast.error("Erro ao carregar estatísticas");
  }
});
</script>

<style scoped>
.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.action-card {
  transition: var(--transition);
  cursor: pointer;
}
.action-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.action-icon {
  font-size: 32px;
  color: var(--primary);
}

@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
  }
}
</style>
