<template>
  <div>
    <div class="page-banner">
      <h1>Aluno → Série</h1>
      <p>Vincule um aluno a uma série específica.</p>
    </div>

    <LoadingSpinner v-if="loadingData" message="Carregando dados..." />

    <div v-else class="form-card card mt-lg">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Aluno</label>
              <select class="form-select" v-model="form.alunoId" required>
                <option :value="null" disabled>Selecione um aluno</option>
                <option v-for="a in filteredAlunos" :key="a.id" :value="a.id">
                  {{ a.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Série</label>
              <select class="form-select" v-model="form.serieId" required>
                <option :value="null" disabled>Selecione uma série</option>
                <option v-for="s in series" :key="s.id" :value="s.id">
                  {{ s.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-actions mt-lg">
            <button
              type="submit"
              class="btn btn-secondary"
              :disabled="saving || !form.alunoId"
            >
              {{ saving ? "Salvando..." : "Vincular Aluno" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="result" class="result-card card mt-lg">
      <div class="card-body">
        <h3 class="font-semibold mb-sm">Vínculo criado com sucesso!</h3>
        <p>
          <strong>Aluno:</strong> {{ result.alunoNome }} (ID:
          {{ result.alunoId }})
        </p>
        <p>
          <strong>Série:</strong> {{ result.serieNome }} (ID:
          {{ result.serieId }})
        </p>
      </div>
    </div>

    <div class="mt-lg" v-if="vinculos.length">
      <h3 class="section-title">Vínculos existentes</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ALUNO</th>
              <th>SÉRIE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vinculos" :key="v.id">
              <td>{{ v.id }}</td>
              <td>{{ v.alunoNome }}</td>
              <td>{{ v.serieNome }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { adminService } from "@/api/services/admin.service";
import { useToastStore } from "@/stores/toast.store";
import type {
  UsersResponse,
  AlunoSerieResponse,
  SerieResponse,
} from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loadingData = ref(true);
const saving = ref(false);
const result = ref<AlunoSerieResponse | null>(null);

const alunos = ref<UsersResponse[]>([]);
const series = ref<SerieResponse[]>([]);
const vinculos = ref<AlunoSerieResponse[]>([]);
const form = ref({
  alunoId: null as number | null,
  serieId: null as number | null,
});

const filteredAlunos = computed(() => {
  return alunos.value.filter((u) => u.tipo?.toUpperCase() === "ALUNO");
});

onMounted(async () => {
  try {
    const [uList, sList, vList] = await Promise.all([
      adminService.listarUsuarios(),
      adminService.listarSeries(),
      adminService.listarAlunoSeries(),
    ]);
    alunos.value = uList;
    series.value = sList;
    vinculos.value = vList;
  } catch {
    toast.error("Erro ao carregar dados do formulário");
  } finally {
    loadingData.value = false;
  }
});

async function handleSubmit() {
  if (!form.value.alunoId || !form.value.serieId) return;
  saving.value = true;
  try {
    result.value = await adminService.adicionarAlunoASerie({
      alunoId: form.value.alunoId,
      serieId: form.value.serieId,
    });
    vinculos.value.push(result.value);
    toast.success("Aluno vinculado com sucesso!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao vincular aluno");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.form-card {
  max-width: 600px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  outline: none;
  font-size: 14px;
  background: var(--bg-white);
  color: var(--text-dark);
}
.form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(45, 61, 225, 0.15);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
}
.result-card {
  max-width: 600px;
  border-left: 4px solid var(--success);
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
