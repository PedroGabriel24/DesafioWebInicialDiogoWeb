<template>
  <div>
    <div class="page-banner">
      <h1>Lançamento de Notas!</h1>
      <p>Selecione uma turma e disciplina para <strong>lançar as notas dos alunos.</strong></p>
    </div>

    <div class="filters-row mt-lg">
      <select
        class="form-select"
        v-model="selectedDisciplina"
        @change="loadAlunos"
      >
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

    <LoadingSpinner v-if="loading" message="Carregando dados..." />
    <LoadingSpinner v-else-if="loadingAlunos" message="Carregando alunos..." />

    <div v-else class="mt-lg">
      <p v-if="!selectedDisciplina" class="text-secondary text-center mt-md">
        Selecione uma turma e disciplina para lançar as notas dos alunos.
      </p>

      <div v-else-if="alunosNotas.length" class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ALUNO</th>
              <th>1º SEM</th>
              <th>2º SEM</th>
              <th>MÉDIA</th>
              <th>STATUS</th>
              <th>AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in alunosNotas" :key="a.id">
              <td>
                <div class="flex items-center gap-sm">
                  <div class="avatar avatar-sm avatar-blue">
                    {{ a.nome.charAt(0) }}
                  </div>
                  <span class="font-medium">{{ a.nome }}</span>
                </div>
              </td>
              <td>
                <input
                  v-if="a.editing"
                  v-model.number="a.nota1"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  class="nota-input"
                  @input="onNotaInput($event, a, 1)"
                />
                <span v-else>{{ a.nota1 != null ? a.nota1 : "-" }}</span>
              </td>
              <td>
                <input
                  v-if="a.editing"
                  v-model.number="a.nota2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  class="nota-input"
                  @input="onNotaInput($event, a, 2)"
                />
                <span v-else>{{ a.nota2 != null ? a.nota2 : "-" }}</span>
              </td>
              <td>
                <span class="font-semibold">{{ a.media }}</span>
              </td>
              <td>
                <span
                  v-if="a.media !== '-'"
                  class="badge"
                  :class="
                    Number(a.media) >= 6 ? 'badge-success' : 'badge-danger'
                  "
                >
                  {{ Number(a.media) >= 6 ? "Aprovado" : "Recuperação" }}
                </span>
                <span v-else class="text-secondary">-</span>
              </td>
              <td>
                <button
                  class="btn btn-sm"
                  :class="a.editing ? 'btn-success' : 'btn-secondary'"
                  @click="toggleEdit(a)"
                  :disabled="a.saving"
                >
                  <span
                    v-if="a.saving"
                    class="spinner"
                    style="width: 14px; height: 14px; border-width: 2px"
                  ></span>
                  <span v-else>{{ a.editing ? "Salvar" : "Lançar" }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-secondary text-center mt-md">
        Nenhum aluno encontrado.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToastStore } from "@/stores/toast.store";
import { useAuthStore } from "@/stores/auth.store";
import { professorService } from "@/api/services/professor.service";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const authStore = useAuthStore();
const loading = ref(true);
const loadingAlunos = ref(false);
const selectedDisciplina = ref("");
const selectedTurma = ref("");

interface AlunoNota {
  id: number;
  nome: string;
  nota1: number | null;
  nota2: number | null;
  media: string;
  editing: boolean;
  saving: boolean;
  alunoSerieId: number;
  turma: string;
}

const disciplinas = ref<{ id: number; nome: string }[]>([]);
const turmas = ref<{ id: number; nome: string }[]>([]);
const alunosNotas = ref<AlunoNota[]>([]);
const alunosNotasCompletos = ref<AlunoNota[]>([]);

function calcMedia(n1: number | null, n2: number | null): string {
  const v1 = n1 != null && !isNaN(n1) ? n1 : null;
  const v2 = n2 != null && !isNaN(n2) ? n2 : null;
  if (v1 == null && v2 == null) return "-";
  if (v1 != null && v2 != null) return ((v1 + v2) / 2).toFixed(1);
  return (v1 ?? v2)!.toFixed(1);
}

function updateMedia(a: AlunoNota) {
  a.media = calcMedia(a.nota1, a.nota2);
}

function onNotaInput(event: Event, a: AlunoNota, semestre: number) {
  const input = event.target as HTMLInputElement;
  const value = parseFloat(input.value);

  if (isNaN(value) || input.value === "") {
    if (semestre === 1) a.nota1 = null;
    else a.nota2 = null;
  } else if (value < 0) {
    if (semestre === 1) a.nota1 = 0;
    else a.nota2 = 0;
  } else if (value > 10) {
    if (semestre === 1) a.nota1 = 10;
    else a.nota2 = 10;
  }

  updateMedia(a);
}

onMounted(async () => {
  try {
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
  } finally {
    loading.value = false;
  }
});

async function loadAlunos() {
  if (!selectedDisciplina.value) {
    alunosNotas.value = [];
    alunosNotasCompletos.value = [];
    return;
  }
  selectedTurma.value = "";
  loadingAlunos.value = true;
  try {
    const data = await professorService.getAlunosPorMateria(
      Number(selectedDisciplina.value),
    );
    console.log("[LancarNotas] Raw API response:", JSON.stringify(data));
    const list = Array.isArray(data)
      ? data
      : (data.alunos ?? Object.values(data) ?? []);
    console.log(
      "[LancarNotas] Parsed list (first item):",
      list.length > 0 ? JSON.stringify(list[0]) : "empty",
    );
    const parsedAlunos = list.map((a: any, i: number) => {
      const notas = a.notas ?? [];
      let n1 =
        notas.find((n: any) => n.periodoId === 1)?.nota ?? a.nota1 ?? null;
      let n2 =
        notas.find((n: any) => n.periodoId === 2)?.nota ?? a.nota2 ?? null;

      n1 = n1 !== null && n1 !== "" ? Number(n1) : null;
      n2 = n2 !== null && n2 !== "" ? Number(n2) : null;

      return {
        id: a.id ?? i + 1,
        nome: a.nome ?? a.name ?? a.alunoNome ?? "",
        nota1: n1,
        nota2: n2,
        media: calcMedia(n1 as number | null, n2 as number | null),
        editing: false,
        saving: false,
        alunoSerieId: a.alunoSerieId ?? a.id ?? i + 1,
        turma: a.turma ?? a.serie ?? "",
      };
    });
    alunosNotasCompletos.value = parsedAlunos;
    alunosNotas.value = parsedAlunos;
  } catch {
    alunosNotas.value = [];
    alunosNotasCompletos.value = [];
  } finally {
    loadingAlunos.value = false;
  }
}

watch(selectedTurma, (val) => {
  if (!val || val === "") {
    alunosNotas.value = alunosNotasCompletos.value;
  } else {
    alunosNotas.value = alunosNotasCompletos.value.filter(
      (a: any) => a.turma === val
    );
  }
});

function isNotaValida(v: number | null): boolean {
  return v != null && !isNaN(v) && v >= 0 && v <= 10;
}

async function toggleEdit(a: AlunoNota) {
  if (!a.editing) {
    a.editing = true;
    return;
  }

  if (a.nota1 != null && !isNotaValida(a.nota1)) {
    toast.error(`Nota 1º SEM de ${a.nome} deve ser entre 0 e 10`);
    return;
  }
  if (a.nota2 != null && !isNotaValida(a.nota2)) {
    toast.error(`Nota 2º SEM de ${a.nome} deve ser entre 0 e 10`);
    return;
  }

  a.saving = true;
  try {
    const mid = Number(selectedDisciplina.value) || 1;
    if (isNotaValida(a.nota1)) {
      await professorService.lancarNota({
        alunoSerieId: Number(a.alunoSerieId),
        materiaId: mid,
        periodoId: 1,
        nota: Number(a.nota1),
      });
    }
    if (isNotaValida(a.nota2)) {
      await professorService.lancarNota({
        alunoSerieId: Number(a.alunoSerieId),
        materiaId: mid,
        periodoId: 2,
        nota: Number(a.nota2),
      });
    }
    a.media = calcMedia(a.nota1, a.nota2);
    a.editing = false;
    toast.success(`Nota de ${a.nome} lançada!`);
  } catch (err: any) {
    console.error(
      "[LancarNotas] Error:",
      err.response?.status,
      err.response?.data,
    );
    toast.error(`Erro ao lançar nota de ${a.nome}`);
  } finally {
    a.saving = false;
  }
}
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
.nota-input {
  width: 70px;
  padding: 6px 10px;
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-sm);
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}
.nota-input:focus {
  box-shadow: 0 0 0 3px rgba(45, 61, 225, 0.15);
}
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-success {
  background: #dcfce7;
  color: #166534;
}
.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .filters-row .form-select {
    width: 100%;
    min-width: unset;
  }
}
</style>
