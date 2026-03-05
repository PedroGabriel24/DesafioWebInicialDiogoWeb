<template>
  <div>
    <div class="page-banner">
      <h1>Observações dos Alunos!</h1>
      <p>
        Registre e acompanhe observações sobre o
        <strong>desempenho e comportamento</strong> dos alunos.
      </p>
    </div>

    <div class="filters-row mt-lg">
      <select class="form-select" v-model="filterDisciplina">
        <option value="">Filtrar por disciplina</option>
        <option v-for="d in disciplinas" :key="d.id" :value="d.id">
          {{ d.nome }}
        </option>
      </select>
      <select class="form-select" v-model="filterTurma">
        <option value="">Filtrar por turma</option>
        <option v-for="t in turmas" :key="t" :value="t">{{ t }}</option>
      </select>
      <button class="btn btn-primary" @click="showModal = true">
        <span class="material-icons-outlined" style="font-size: 18px">add</span>
        Adicionar Observação
      </button>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando observações..." />

    <div v-else class="obs-list mt-lg">
      <div v-for="(obs, i) in filteredObs" :key="i" class="obs-card card">
        <div class="card-body">
          <div class="obs-header">
            <div class="flex items-center gap-sm">
              <div class="avatar avatar-sm" :class="avatarColor(obs.nome)">
                {{ getInitial(obs.nome) }}
              </div>
              <div>
                <p class="font-semibold" style="font-size: 14px">
                  {{ obs.nome }}
                </p>
                <p class="text-sm text-secondary">Aluno(a)</p>
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
          <p class="obs-author text-sm text-secondary mt-xs">
            Por: {{ authorName }}
          </p>
        </div>
      </div>

      <p v-if="!filteredObs.length" class="text-center text-secondary mt-md">
        Nenhuma observação encontrada.
      </p>
    </div>

    <!-- Modal Nova Observação -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nova observação</h2>
          <p>Preencha os dados abaixo para registrar a observação do aluno.</p>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Selecione o aluno</label>
            <select class="form-select w-full" v-model="modalForm.alunoId">
              <option :value="0" disabled>selecionar aluno</option>
              <option v-for="a in alunosList" :key="a.id" :value="a.id">
                {{ a.nome }}
              </option>
            </select>
          </div>
          <div class="form-group mt-md">
            <label class="form-label">Selecione a disciplina</label>
            <select class="form-select w-full" v-model="modalForm.disciplina">
              <option value="" disabled>selecionar disciplina</option>
              <option v-for="d in disciplinas" :key="d.id" :value="d.nome">
                {{ d.nome }}
              </option>
            </select>
          </div>
          <div class="form-group mt-md">
            <label class="form-label">Tipo de observação</label>
            <select class="form-select w-full" v-model="modalForm.status">
              <option value="" disabled>selecionar tipo</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
              <option value="neutro">Neutro</option>
            </select>
          </div>
          <div class="form-group mt-md">
            <label class="form-label">Descrição</label>
            <textarea
              class="form-textarea"
              v-model="modalForm.mensagem"
              rows="4"
              placeholder="Descreva a observação sobre o aluno..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showModal = false">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="submitObservacao"
            :disabled="
              savingObs ||
              !modalForm.alunoId ||
              !modalForm.status ||
              !modalForm.mensagem
            "
          >
            <span class="material-icons-outlined" style="font-size: 16px"
              >save</span
            >
            {{ savingObs ? "Salvando..." : "Salvar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { professorService } from "@/api/services/professor.service";
import type { ObservacoesResponse } from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const authStore = useAuthStore();
const toast = useToastStore();
const loading = ref(true);
const showModal = ref(false);
const savingObs = ref(false);
const filterDisciplina = ref("");
const filterTurma = ref("");
const observacoes = ref<ObservacoesResponse[]>([]);

interface SimpleItem {
  id: number;
  nome: string;
}
interface AlunoItem {
  id: number;
  nome: string;
  turma: string;
}

const disciplinas = ref<SimpleItem[]>([]);
const alunosList = ref<AlunoItem[]>([]);
const turmas = ref<string[]>([]);

const authorName = computed(() => authStore.userName || "Professor");

const modalForm = ref({
  alunoId: 0,
  disciplina: "",
  status: "",
  mensagem: "",
});

const colors = [
  "avatar-blue",
  "avatar-green",
  "avatar-purple",
  "avatar-orange",
];
function avatarColor(n: string) {
  return colors[(n || "A").charCodeAt(0) % colors.length];
}
function getInitial(nome: string) {
  return (nome || "?").charAt(0).toUpperCase();
}

function statusBadge(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "positivo") return "badge-success";
  if (s === "negativo") return "badge-danger";
  return "badge-neutral";
}

function formatDate(dateStr: string) {
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

const filteredObs = computed(() => {
  return observacoes.value;
});

onMounted(async () => {
  try {
    const [obsData, dashData] = await Promise.all([
      professorService.listarObservacoes(),
      professorService.getDashboard(),
    ]);
    observacoes.value = Array.isArray(obsData) ? obsData : [];

    if (dashData.materias && Array.isArray(dashData.materias)) {
      disciplinas.value = dashData.materias.map((m: any, i: number) => ({
        id: m.materiaId ?? i + 1,
        nome: m.nome ?? "",
      }));

      const allAlunos: AlunoItem[] = [];
      const turmaSet = new Set<string>();
      for (const d of disciplinas.value) {
        try {
          const data = await professorService.getAlunosPorMateria(d.id);
          const list = Array.isArray(data) ? data : (data.alunos ?? []);
          for (const a of list) {
            const turma = a.turma ?? a.serie ?? "";
            if (turma) turmaSet.add(turma);
            if (!allAlunos.find((x) => x.id === (a.id ?? a.alunoId))) {
              allAlunos.push({
                id: a.id ?? a.alunoId ?? 0,
                nome: a.nome ?? a.name ?? a.alunoNome ?? "",
                turma,
              });
            }
          }
        } catch {
        }
      }
      alunosList.value = allAlunos;
      turmas.value = Array.from(turmaSet).sort();
    }
  } catch {
    toast.error("Erro ao carregar observações");
  } finally {
    loading.value = false;
  }
});

async function submitObservacao() {
  savingObs.value = true;
  try {
    await professorService.adicionarObservacao({
      alunoId: modalForm.value.alunoId,
      status: modalForm.value.status,
      mensagem: modalForm.value.mensagem,
    });
    toast.success("Observação registrada com sucesso!");
    showModal.value = false;
    const obsData = await professorService.listarObservacoes();
    observacoes.value = Array.isArray(obsData) ? obsData : [];
    modalForm.value = { alunoId: 0, disciplina: "", status: "", mensagem: "" };
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao registrar observação");
  } finally {
    savingObs.value = false;
  }
}
</script>

<style scoped>
.filters-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}
.filters-row .form-select {
  min-width: 200px;
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
.obs-author {
  font-size: 12px;
}
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  outline: none;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: var(--bg-white);
  color: var(--text-dark);
}
.form-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(45, 61, 225, 0.15);
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  .filters-row .form-select {
    min-width: unset;
    width: 100%;
  }
  .obs-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
