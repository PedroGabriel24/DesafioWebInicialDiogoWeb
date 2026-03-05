<template>
  <div>
    <div class="page-banner">
      <h1>Minhas Observações!</h1>
      <p>
        Veja as <strong>observações</strong> registradas pelos professores sobre
        seu desempenho.
      </p>
    </div>

    <div class="stats-row mt-lg">
      <StatsCard
        label="POSITIVAS"
        :value="countByStatus('positiva') + countByStatus('positivo')"
        color="var(--success)"
      />
      <StatsCard
        label="NEGATIVAS"
        :value="countByStatus('negativo') + countByStatus('negativa')"
        color="var(--danger)"
      />
      <StatsCard
        label="NEUTRAS"
        :value="countByStatus('neutro') + countByStatus('neutra')"
        color="var(--text-secondary)"
      />
    </div>

    <LoadingSpinner v-if="loading" message="Carregando observações..." />

    <div v-else class="obs-list mt-lg">
      <div v-for="(obs, i) in observacoes" :key="i" class="obs-card card">
        <div class="card-body">
          <div class="obs-header">
            <div class="flex items-center gap-sm">
              <div class="avatar avatar-sm avatar-blue">
                {{ getInitial(obs.nome) }}
              </div>
              <div>
                <p class="font-semibold" style="font-size: 14px">
                  Professor(a) {{ obs.nome }}
                </p>
                <p class="text-sm text-secondary">{{ obs.materia || "" }}</p>
              </div>
            </div>
            <div class="flex items-center gap-sm">
              <span class="badge" :class="statusBadge(obs.status)">{{
                obs.status
              }}</span>
              <span class="obs-date">
                <span class="material-icons-outlined" style="font-size: 14px"
                  >calendar_today</span
                >
                {{ formatDate(obs.data) }}
              </span>
            </div>
          </div>
          <p class="obs-msg mt-sm">{{ obs.mensagem }}</p>
        </div>
      </div>

      <p v-if="!observacoes.length" class="text-center text-secondary mt-md">
        Nenhuma observação registrada.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { alunoService } from "@/api/services/aluno.service";
import { useToastStore } from "@/stores/toast.store";
import type { ObservacoesResponse } from "@/api/types";
import StatsCard from "@/components/StatsCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loading = ref(true);
const observacoes = ref<(ObservacoesResponse & { materia?: string })[]>([]);

function countByStatus(status: string): number {
  return observacoes.value.filter(
    (o) => (o.status || "").toLowerCase() === status.toLowerCase(),
  ).length;
}

function getInitial(nome: string): string {
  return (nome || "?").charAt(0).toUpperCase();
}

function statusBadge(status: string): string {
  const s = (status || "").toLowerCase();
  if (s === "positivo" || s === "positiva") return "badge-success";
  if (s === "negativo" || s === "negativa") return "badge-danger";
  if (s === "neutro" || s === "neutra") return "badge-neutral";
  return "badge-neutral";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

onMounted(async () => {
  try {
    const data = await alunoService.listarObservacoes();
    observacoes.value = Array.isArray(data) ? data : [];
  } catch {
    toast.error("Erro ao carregar observações");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.obs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.obs-card {
  transition: var(--transition);
}
.obs-card:hover {
  box-shadow: var(--shadow-md);
}
.obs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.obs-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}
.obs-msg {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-dark);
}

@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
  }
  .obs-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
