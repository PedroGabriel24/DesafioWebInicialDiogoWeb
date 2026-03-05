<template>
  <div>
    <div class="page-banner">
      <h1>Matéria → Série</h1>
      <p>Vincule matérias a séries específicas.</p>
    </div>

    <LoadingSpinner v-if="loadingData" message="Carregando dados..." />

    <div v-else class="form-card card mt-lg">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
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
              :disabled="saving || !form.materiaId || !form.serieId"
            >
              {{ saving ? "Salvando..." : "Vincular" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="result" class="result-card card mt-lg">
      <div class="card-body">
        <h3 class="font-semibold mb-sm">Vínculo criado com sucesso!</h3>
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

    <div class="mt-lg" v-if="vinculos.length">
      <h3 class="section-title">Vínculos existentes</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>MATÉRIA</th>
              <th>SÉRIE</th>
              <th>AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vinculos" :key="v.id">
              <td>{{ v.id }}</td>
              <td>{{ v.materiaNome }}</td>
              <td>{{ v.serieNome }}</td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteVinculo(v.id)"
                >
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >delete</span
                  >
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { adminService } from "@/api/services/admin.service";
import { useToastStore } from "@/stores/toast.store";
import type {
  MateriaResponse,
  SerieResponse,
  SerieMateriaResponse,
} from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loadingData = ref(true);
const saving = ref(false);
const result = ref<SerieMateriaResponse | null>(null);
const materias = ref<MateriaResponse[]>([]);
const series = ref<SerieResponse[]>([]);
const vinculos = ref<SerieMateriaResponse[]>([]);

const form = ref({
  materiaId: null as number | null,
  serieId: null as number | null,
});

onMounted(async () => {
  try {
    const [mList, sList] = await Promise.all([
      adminService.listarMaterias(),
      adminService.listarSeries(),
    ]);
    materias.value = mList;
    series.value = sList;

    const allVinculos: SerieMateriaResponse[] = [];
    for (const s of sList) {
      try {
        const data = await adminService.listarSerieMateriasPorSerie(s.id);
        allVinculos.push(...data);
      } catch {
      }
    }
    vinculos.value = allVinculos;
  } catch {
    toast.error("Erro ao carregar dados");
  } finally {
    loadingData.value = false;
  }
});

async function handleSubmit() {
  if (!form.value.materiaId || !form.value.serieId) return;
  saving.value = true;
  try {
    const res = await adminService.criarSerieMateria({
      serieId: form.value.serieId,
      materiaId: form.value.materiaId,
    });
    result.value = res;
    vinculos.value.push(res);
    toast.success("Vínculo criado com sucesso!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao criar vínculo");
  } finally {
    saving.value = false;
  }
}

async function deleteVinculo(id: number) {
  try {
    await adminService.deletarSerieMateria(id);
    vinculos.value = vinculos.value.filter((v) => v.id !== id);
    toast.success("Vínculo removido!");
  } catch {
    toast.error("Erro ao remover vínculo");
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
