<template>
  <div>
    <div class="page-banner">
      <h1>Olá, Professor(a) {{ authStore.userName }}!</h1>
      <p>Bem-vindo ao painel de <strong>gestão de disciplinas</strong>.</p>
    </div>

    <div class="filters-row mt-lg">
      <select class="form-select" v-model="selectedDisciplina">
        <option value="">Filtrar por disciplina</option>
        <option v-for="d in disciplinas" :key="d.id" :value="d.id">
          {{ d.nome }}
        </option>
      </select>
      <select class="form-select" v-model="selectedTurma">
        <option value="">Filtrar por turma</option>
        <option v-for="t in turmas" :key="t.id" :value="t.nome">
          {{ t.nome }}
        </option>
      </select>
    </div>

    <div class="stats-row mt-lg">
      <StatsCard
        label="TOTAL DE ALUNOS"
        :value="stats.totalAlunos"
        sub="Ativos no semestre"
      />
      <StatsCard
        label="MÉDIA DA TURMA"
        :value="stats.mediaTurma"
        sub="Geral da disciplina"
      />
      <StatsCard
        label="PENDÊNCIAS"
        :value="stats.pendencias"
        sub="Notas para fechar"
        color="var(--secondary)"
      />
    </div>

    <div class="cta-card card mt-lg">
      <div class="card-body flex items-center justify-between cta-inner">
        <div>
          <h3 style="font-size: 16px; font-weight: 700">
            Precisa lançar nota?
          </h3>
          <p class="text-secondary text-sm">
            Acesse a área de lançamento para atualizar o boletim.
          </p>
        </div>
        <router-link to="/professor/lancar-notas" class="btn btn-secondary"
          >Ir para Lançamentos →</router-link
        >
      </div>
    </div>

    <div class="mt-lg">
      <h3 class="section-title">Lista de alunos</h3>
      <LoadingSpinner v-if="loadingAlunos" message="Carregando alunos..." />
      <div v-else class="student-list">
        <StudentCard
          v-for="aluno in alunos"
          :key="aluno.id"
          :name="aluno.nome"
          role="Aluno(a)"
          :matricula="aluno.matricula"
          :turma="aluno.turma"
        />
        <p v-if="!alunos.length" class="text-secondary text-center mt-md">
          Nenhum aluno encontrado.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { professorService } from "@/api/services/professor.service";
import StatsCard from "@/components/StatsCard.vue";
import StudentCard from "@/components/StudentCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const route = useRoute();
const authStore = useAuthStore();
const toast = useToastStore();
const loadingAlunos = ref(false);
const selectedDisciplina = ref("");
const selectedTurma = ref("");
const stats = ref({ totalAlunos: 0, mediaTurma: "0.0", pendencias: 0 });

interface SimpleItem {
  id: number;
  nome: string;
}
interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  turma: string;
}

const disciplinas = ref<SimpleItem[]>([]);
const turmas = ref<SimpleItem[]>([]);
const alunos = ref<Aluno[]>([]);

const loadData = async () => {
  if (!selectedDisciplina.value || !selectedTurma.value) return;

  loadingAlunos.value = true;
  try {
    const disciplinaId = Number(selectedDisciplina.value);
    const data = await professorService.getAlunosPorMateria(disciplinaId);
    const list = Array.isArray(data) ? data : (data.alunos ?? []);
    const filtered = list.filter(
      (a: any) => (a.turma ?? a.serie ?? "") === selectedTurma.value
    );
    alunos.value = filtered.map((a: any, i: number) => ({
      id: a.id ?? i + 1,
      nome: a.nome ?? a.name ?? "",
      matricula: a.matricula ?? "",
      turma: a.turma ?? a.serie ?? "",
    }));

    let total = 0, soma = 0, pend = 0;
    for (const a of filtered) {
      total++;
    }
    stats.value = {
      totalAlunos: total,
      mediaTurma: "0.0",
      pendencias: pend,
    };
  } catch {
    alunos.value = [];
    stats.value = { totalAlunos: 0, mediaTurma: "0.0", pendencias: 0 };
  } finally {
    loadingAlunos.value = false;
  }
};

onMounted(async () => {
  try {
    const data = await professorService.getDashboard();

    const extras = authStore.decoded?.payload?.extras || [];
    const materiaMap = new Map<number, string>();
    const serieSet = new Set<string>();

    for (const e of extras) {
      if (e.materiaId && e.materia) {
        materiaMap.set(Number(e.materiaId), e.materia);
      }
      if (e.serie) {
        serieSet.add(e.serie);
      }
    }

    disciplinas.value = Array.from(materiaMap.entries()).map(([id, nome]) => ({
      id,
      nome,
    }));

    turmas.value = Array.from(serieSet).sort().map((nome, i) => ({
      id: i + 1,
      nome,
    }));

    selectedDisciplina.value = (route.query.disciplinaId as string) || "";
    selectedTurma.value = (route.query.turmaId as string) || "";

    if (selectedDisciplina.value && selectedTurma.value) {
      await loadData();
    }
  } catch (err: any) {
    if (err.response?.status !== 401) toast.error("Erro ao carregar dashboard");
  }
});

watch([selectedDisciplina, selectedTurma], async () => {
  alunos.value = [];
  stats.value = { totalAlunos: 0, mediaTurma: "0.0", pendencias: 0 };
  await loadData();
});
</script>

<style scoped>
.filters-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.filters-row .form-select {
  min-width: 200px;
}
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
.student-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 768px) {
  .filters-row .form-select {
    width: 100%;
    min-width: unset;
  }
  .stats-row {
    flex-direction: column;
  }
  .cta-inner {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start !important;
  }
}
</style>
