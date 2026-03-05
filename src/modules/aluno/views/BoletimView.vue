<template>
  <div>
    <div class="page-banner">
      <div class="flex items-center justify-between w-full">
        <div>
          <h1>Meu Boletim</h1>
          <p>Acompanhe suas notas em todas as disciplinas.</p>
        </div>
        <button
          v-if="boletim"
          class="btn btn-primary"
          @click="downloadPdf"
          :disabled="downloadingPdf"
        >
          <span
            v-if="downloadingPdf"
            class="spinner"
            style="width: 14px; height: 14px; border-width: 2px"
          ></span>
          <span v-else class="material-icons-outlined" style="font-size: 18px"
            >picture_as_pdf</span
          >
          <span v-if="!downloadingPdf">Baixar PDF</span>
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando boletim..." />

    <div v-else-if="boletim" class="mt-lg">
      <p class="text-lg mb-md">
        <strong>Aluno:</strong> {{ boletim.alunoNome }}
      </p>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>DISCIPLINA</th>
              <th v-for="p in periodos" :key="p">{{ p }}</th>
              <th>MÉDIA</th>
              <th>SITUAÇÃO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in boletim.disciplinas" :key="d.materiaId">
              <td>
                <span class="font-semibold">{{ d.materiaNome }}</span>
              </td>
              <td v-for="p in periodos" :key="p">{{ getNota(d, p) }}</td>
              <td>
                <span class="font-bold" :class="mediaClass(media(d))">{{
                  media(d)
                }}</span>
              </td>
              <td>
                <span class="badge" :class="situacaoBadge(media(d))">{{
                  situacao(media(d))
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-else class="text-center text-secondary mt-lg">
      Boletim não disponível.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { alunoService } from "@/api/services/aluno.service";
import { useToastStore } from "@/stores/toast.store";
import type { BoletimResponse, DisciplinaNotas } from "@/api/types";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToastStore();
const loading = ref(true);
const downloadingPdf = ref(false);
const boletim = ref<BoletimResponse | null>(null);

const periodos = computed(() => {
  if (!boletim.value?.disciplinas?.length) return [];
  const set = new Set<string>();
  boletim.value.disciplinas.forEach((d) =>
    d.notas.forEach((n) => set.add(n.periodoNome)),
  );
  return Array.from(set).sort();
});

const getNota = (d: DisciplinaNotas, p: string) =>
  d.notas.find((n) => n.periodoNome === p)?.nota?.toFixed(1) ?? "-";

function media(d: DisciplinaNotas): string {
  const vals = d.notas.filter((n) => n.nota != null).map((n) => n.nota);
  return vals.length
    ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
    : "-";
}

const mediaClass = (m: string) => {
  const n = parseFloat(m);
  return isNaN(n) ? "" : n >= 6 ? "text-success" : "text-danger";
};
const situacao = (m: string) => {
  const n = parseFloat(m);
  return isNaN(n) ? "Pendente" : n >= 6 ? "Aprovado" : "Recuperação";
};
const situacaoBadge = (m: string) => {
  const n = parseFloat(m);
  return isNaN(n) ? "badge-neutral" : n >= 6 ? "badge-success" : "badge-danger";
};

onMounted(async () => {
  try {
    boletim.value = await alunoService.obterBoletim();
  } catch {
    toast.error("Erro ao carregar boletim");
  } finally {
    loading.value = false;
  }
});

async function downloadPdf() {
  downloadingPdf.value = true;
  try {
    const blob = await alunoService.baixarBoletimPdf();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Boletim_${boletim.value?.alunoNome || "Aluno"}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("Boletim baixado com sucesso!");
  } catch (err: any) {
    toast.error("Erro ao fazer download do PDF do boletim");
  } finally {
    downloadingPdf.value = false;
  }
}
</script>
