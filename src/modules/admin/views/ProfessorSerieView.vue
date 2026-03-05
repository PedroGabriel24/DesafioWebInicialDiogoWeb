<template>
  <div>
    <div class="page-banner">
      <h1>Professor → Matéria/Série</h1>
      <p>Vincule um professor a uma matéria em uma série específica.</p>
    </div>

    <LoadingSpinner v-if="loadingData" message="Carregando dados..." />

    <div v-else class="form-card card mt-lg">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Professor</label>
              <select class="form-select" v-model="form.professorId" required>
                <option :value="null" disabled>Selecione um professor</option>
                <option
                  v-for="p in filteredProfessors"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Matéria</label>
              <select class="form-select" v-model="form.materiaId" required>
                <option :value="null" disabled>Selecione uma matéria</option>
                <option v-for="m in materias" :key="m.id" :value="m.id">
                  {{ m.nome }}
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
              :disabled="saving || !form.professorId"
            >
              {{ saving ? "Salvando..." : "Vincular Professor" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="result" class="result-card card mt-lg">
      <div class="card-body">
        <h3 class="font-semibold mb-sm">Vínculo criado com sucesso!</h3>
        <p>
          <strong>Professor:</strong> {{ result.professorNome }} (ID:
          {{ result.professorId }})
        </p>
        <p>
          <strong>Matéria:</strong> {{ result.materiaNome }} (ID:
          {{ result.materiaId }})
        </p>
        <p>
          <strong>Série:</strong> {{ result.serieNome }} (ID:
          {{ result.serieId }})
        </p>
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
  ProfessorMateriaSerieResponse,
  MateriaResponse,
  SerieResponse,
} from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loadingData = ref(true);
const saving = ref(false);
const result = ref<ProfessorMateriaSerieResponse | null>(null);

const professors = ref<UsersResponse[]>([]);
const materias = ref<MateriaResponse[]>([]);
const series = ref<SerieResponse[]>([]);
const form = ref({
  professorId: null as number | null,
  materiaId: null as number | null,
  serieId: null as number | null,
});

const filteredProfessors = computed(() => {
  return professors.value.filter((u) => u.tipo?.toUpperCase() === "PROFESSOR");
});

onMounted(async () => {
  try {
    const [uList, mList, sList] = await Promise.all([
      adminService.listarUsuarios(),
      adminService.listarMaterias(),
      adminService.listarSeries(),
    ]);
    professors.value = uList;
    materias.value = mList;
    series.value = sList;
  } catch {
    toast.error("Erro ao carregar dados do formulário");
  } finally {
    loadingData.value = false;
  }
});

async function handleSubmit() {
  if (!form.value.professorId || !form.value.materiaId || !form.value.serieId)
    return;
  saving.value = true;
  try {
    result.value = await adminService.adicionarProfessorASerie({
      professorId: form.value.professorId,
      materiaId: form.value.materiaId,
      serieId: form.value.serieId,
    });
    toast.success("Professor vinculado com sucesso!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao vincular professor");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.form-card {
  max-width: 700px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
  max-width: 700px;
  border-left: 4px solid var(--success);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
