<template>
  <div>
    <div class="page-banner">
      <h1>Minhas Matérias</h1>
      <p>Acompanhe todas as disciplinas em que você está matriculado.</p>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando matérias..." />

    <div v-else class="materias-grid mt-lg">
      <div v-for="m in materias" :key="m.id" class="materia-card card">
        <div class="card-body">
          <div class="materia-icon-wrapper">
            <span class="material-icons-outlined materia-icon">{{
              getIcon(m.nome)
            }}</span>
          </div>
          <h3 class="materia-nome">{{ m.nome }}</h3>
          <p class="text-sm text-secondary" v-if="m.serie">{{ m.serie }}</p>
        </div>
      </div>
      <p v-if="!materias.length" class="text-center text-secondary">
        Nenhuma matéria encontrada.
      </p>
    </div>

    <div class="mt-xl">
      <router-link to="/aluno/boletim" class="btn btn-primary">
        <span class="material-icons-outlined" style="font-size: 18px"
          >assessment</span
        >
        Ver Boletim Completo
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { alunoService } from "@/api/services/aluno.service";
import { useToastStore } from "@/stores/toast.store";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loading = ref(true);
const materias = ref<{ id: number; nome: string; serie?: string }[]>([]);

const iconMap: [string, string][] = [
  ["mat", "calculate"],
  ["port", "menu_book"],
  ["lingu", "menu_book"],
  ["ciên", "science"],
  ["bio", "science"],
  ["quim", "science"],
  ["fis", "science"],
  ["hist", "history_edu"],
  ["geo", "public"],
  ["art", "palette"],
  ["ingl", "translate"],
  ["esp", "translate"],
];

function getIcon(nome: string): string {
  if (!nome) return "school";
  const n = nome.toLowerCase();
  return iconMap.find(([k]) => n.includes(k))?.[1] ?? "school";
}

onMounted(async () => {
  try {
    const data = await alunoService.listarMaterias();
    if (Array.isArray(data)) {
      materias.value = data.map((item: any, i: number) => ({
        id: i + 1,
        nome: item.materia ?? item.nome ?? "",
        serie: item.serie ?? "",
      }));
    }
  } catch {
    toast.error("Erro ao carregar matérias");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.materias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.materia-card {
  text-align: center;
  padding: 8px;
  transition: var(--transition);
  cursor: pointer;
}
.materia-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}
.materia-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.materia-icon {
  font-size: 28px;
  color: var(--primary);
}
.materia-nome {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 4px;
}
.mt-xl {
  margin-top: 32px;
}
</style>
