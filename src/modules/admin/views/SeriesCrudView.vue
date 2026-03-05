<template>
  <div>
    <div class="page-banner">
      <h1>Gestão de Séries</h1>
      <p>Cadastre, edite e gerencie as séries/turmas da plataforma.</p>
    </div>

    <div class="actions-row mt-lg">
      <div class="form-input search-box">
        <span class="material-icons-outlined icon">search</span>
        <input v-model="search" placeholder="Buscar série..." />
      </div>
      <button class="btn btn-primary" @click="openModal(null)">
        <span class="material-icons-outlined" style="font-size: 18px">add</span>
        Nova Série
      </button>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando séries..." />

    <div v-else class="mt-lg table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOME</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filteredSeries" :key="s.id">
            <td>{{ s.id }}</td>
            <td>
              <span class="font-medium">{{ s.nome }}</span>
            </td>
            <td>
              <div class="flex gap-xs">
                <button class="btn btn-outline btn-sm" @click="openModal(s)">
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >edit</span
                  >
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteTarget = s">
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >delete</span
                  >
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!filteredSeries.length" class="text-center text-secondary mt-md">
        Nenhuma série encontrada.
      </p>
    </div>

    <!-- Modal Criar/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content" style="max-width: 420px">
        <div class="modal-header">
          <h2>{{ editing ? "Editar Série" : "Nova Série" }}</h2>
          <p>
            {{
              editing
                ? "Atualize o nome da série."
                : "Preencha o nome da nova série."
            }}
          </p>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome da série *</label>
            <div class="form-input">
              <span class="material-icons-outlined icon">class</span>
              <input v-model="formNome" placeholder="Ex: 1ª Série" required />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showModal = false">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="handleSave"
            :disabled="saving || !formNome.trim()"
          >
            {{ saving ? "Salvando..." : editing ? "Atualizar" : "Criar" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Excluir -->
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
import type { SerieResponse } from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loading = ref(true);
const search = ref("");
const showModal = ref(false);
const saving = ref(false);
const editing = ref<SerieResponse | null>(null);
const formNome = ref("");
const series = ref<SerieResponse[]>([]);
const deleteTarget = ref<SerieResponse | null>(null);

const filteredSeries = computed(() => {
  const s = search.value.toLowerCase();
  if (!s) return series.value;
  return series.value.filter((item) => item.nome.toLowerCase().includes(s));
});

function openModal(s: SerieResponse | null) {
  editing.value = s;
  formNome.value = s ? s.nome : "";
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    if (editing.value) {
      const updated = await adminService.atualizarSerie(editing.value.id, {
        nome: formNome.value,
      });
      const idx = series.value.findIndex((s) => s.id === editing.value!.id);
      if (idx !== -1) series.value[idx] = updated;
      toast.success("Série atualizada!");
    } else {
      const created = await adminService.criarSerie({ nome: formNome.value });
      series.value.push(created);
      toast.success("Série criada!");
    }
    showModal.value = false;
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao salvar série");
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  try {
    await adminService.deletarSerie(deleteTarget.value.id);
    series.value = series.value.filter((s) => s.id !== deleteTarget.value!.id);
    toast.success("Série excluída!");
  } catch {
    toast.error("Erro ao excluir série");
  }
  deleteTarget.value = null;
}

onMounted(async () => {
  try {
    series.value = await adminService.listarSeries();
  } catch {
    toast.error("Erro ao carregar séries");
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
