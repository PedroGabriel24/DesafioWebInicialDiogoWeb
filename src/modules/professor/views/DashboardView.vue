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
      <select class="form-select" v-model="selectedTurma" @change="loadTurmas">
        <option value="">Filtrar por turma</option>
        <option v-for="t in turmas" :key="t.id" :value="t.id">
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
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { professorService } from "@/api/services/professor.service";
import StatsCard from "@/components/StatsCard.vue";
import StudentCard from "@/components/StudentCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

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

onMounted(async () => {
  try {
    const data = await professorService.getDashboard();
    if (data.materias && Array.isArray(data.materias)) {
      const materias = data.materias as any[];
      disciplinas.value = materias.map((m: any, i: number) => ({
        id: m.materiaId ?? i + 1,
        nome: m.nome ?? "",
      }));

      let total = 0,
        soma = 0,
        pend = 0;
      for (const m of materias) {
        total += m.totalAlunos ?? 0;
        soma += m.mediaTurma ?? 0;
      }

      for (const d of disciplinas.value) {
        try {
          const alunosData = await professorService.getAlunosPorMateria(d.id);
          const list = Array.isArray(alunosData)
            ? alunosData
            : (alunosData.alunos ?? []);
          for (const a of list) {
            const notas = a.notas ?? [];
            const n1 =
              notas.find((n: any) => n.periodoId === 1)?.nota ??
              a.nota1 ??
              null;
            const n2 =
              notas.find((n: any) => n.periodoId === 2)?.nota ??
              a.nota2 ??
              null;
            if (n1 === null || n1 === "") pend++;
            if (n2 === null || n2 === "") pend++;
          }
        } catch {}
      }

      stats.value = {
        totalAlunos: total,
        mediaTurma: materias.length
          ? (soma / materias.length).toFixed(1)
          : "0.0",
        pendencias: pend,
      };

      const turmaSet = new Set<string>();
      for (const d of disciplinas.value) {
        try {
          const alunosData = await professorService.getAlunosPorMateria(d.id);
          const list = Array.isArray(alunosData)
            ? alunosData
            : (alunosData.alunos ?? []);
          for (const a of list) {
            const turma = a.turma ?? a.serie ?? "";
            if (turma) turmaSet.add(turma);
          }
        } catch {}
      }
      turmas.value = Array.from(turmaSet)
        .sort()
        .map((nome, i) => ({ id: i + 1, nome }));
    }
  } catch (err: any) {
    if (err.response?.status !== 401) toast.error("Erro ao carregar dashboard");
  }
});

watch(selectedDisciplina, async (val) => {
  selectedTurma.value = "";
  if (!val) {
    alunos.value = [];
    return;
  }
  loadingAlunos.value = true;
  try {
    const data = await professorService.getAlunosPorMateria(Number(val));
    const list = Array.isArray(data) ? data : (data.alunos ?? []);
    alunos.value = list.map((a: any, i: number) => ({
      id: a.id ?? i + 1,
      nome: a.nome ?? a.name ?? "",
      matricula: a.matricula ?? "",
      turma: a.turma ?? a.serie ?? "",
    }));
  } catch {
    alunos.value = [];
  } finally {
    loadingAlunos.value = false;
  }
});

watch(selectedTurma, async (val) => {
  loadingAlunos.value = true;
  try {
    const disciplinaId = Number(selectedDisciplina.value);
    if (!disciplinaId) {
      alunos.value = [];
      return;
    }

    const data = await professorService.getAlunosPorMateria(disciplinaId);
    const list = Array.isArray(data) ? data : (data.alunos ?? []);
    const filtered = val
      ? list.filter(
          (a: any) => (a.turma ?? a.serie ?? "") === val
        )
      : list;
    alunos.value = filtered.map((a: any, i: number) => ({
      id: a.id ?? i + 1,
      nome: a.nome ?? a.name ?? "",
      matricula: a.matricula ?? "",
      turma: a.turma ?? a.serie ?? "",
    }));
  } catch {
    alunos.value = [];
  } finally {
    loadingAlunos.value = false;
  }
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
