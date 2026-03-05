<template>
  <div>
    <div class="page-banner">
      <h1>Gestão de Matérias</h1>
      <p>Cadastre, edite e gerencie as disciplinas da plataforma.</p>
    </div>

    <div class="actions-row mt-lg">
      <div class="form-input search-box">
        <span class="material-icons-outlined icon">search</span>
        <input v-model="search" placeholder="Buscar matéria..." />
      </div>
      <button class="btn btn-secondary" @click="openModal(null)">
        <span class="material-icons-outlined" style="font-size: 18px">add</span>
        Nova Matéria
      </button>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando matérias..." />

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
          <tr v-for="m in filteredMaterias" :key="m.id">
            <td>{{ m.id }}</td>
            <td>
              <span class="font-medium">{{ m.nome }}</span>
            </td>
            <td>
              <div class="flex gap-xs">
                <button class="btn btn-outline btn-sm" @click="openModal(m)">
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >edit</span
                  >
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteTarget = m">
                  <span class="material-icons-outlined" style="font-size: 14px"
                    >delete</span
                  >
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-if="!filteredMaterias.length"
        class="text-center text-secondary mt-md"
      >
        Nenhuma matéria encontrada.
      </p>
    </div>

    <!-- Modal Criar/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content" style="max-width: 420px">
        <div class="modal-header">
          <h2>{{ editing ? "Editar Matéria" : "Nova Matéria" }}</h2>
          <p>
            {{
              editing
                ? "Atualize o nome da disciplina."
                : "Preencha o nome da nova disciplina."
            }}
          </p>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome da matéria *</label>
            <div class="form-input">
              <span class="material-icons-outlined icon">menu_book</span>
              <input v-model="formNome" placeholder="Ex: Matemática" required />
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
import type { MateriaResponse } from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loading = ref(true);
const search = ref("");
const showModal = ref(false);
const saving = ref(false);
const editing = ref<MateriaResponse | null>(null);
const formNome = ref("");
const materias = ref<MateriaResponse[]>([]);
const deleteTarget = ref<MateriaResponse | null>(null);

const filteredMaterias = computed(() => {
  const s = search.value.toLowerCase();
  if (!s) return materias.value;
  return materias.value.filter((m) => m.nome.toLowerCase().includes(s));
});

function openModal(m: MateriaResponse | null) {
  editing.value = m;
  formNome.value = m ? m.nome : "";
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    if (editing.value) {
      const updated = await adminService.atualizarMateria(editing.value.id, {
        nome: formNome.value,
      });
      const idx = materias.value.findIndex((m) => m.id === editing.value!.id);
      if (idx !== -1) materias.value[idx] = updated;
      toast.success("Matéria atualizada!");
    } else {
      const created = await adminService.criarMateria({ nome: formNome.value });
      materias.value.push(created);
      toast.success("Matéria criada!");
    }
    showModal.value = false;
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao salvar matéria");
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  try {
    await adminService.deletarMateria(deleteTarget.value.id);
    materias.value = materias.value.filter(
      (m) => m.id !== deleteTarget.value!.id,
    );
    toast.success("Matéria excluída!");
  } catch {
    toast.error("Erro ao excluir matéria");
  }
  deleteTarget.value = null;
}

onMounted(async () => {
  try {
    materias.value = await adminService.listarMaterias();
  } catch {
    toast.error("Erro ao carregar matérias");
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
