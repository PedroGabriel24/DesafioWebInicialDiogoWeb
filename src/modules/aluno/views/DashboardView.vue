<template>
  <div>
    <div class="page-banner">
      <h1>Olá, {{ authStore.userName }}!</h1>
      <p>Acompanhe suas <strong>notas e desempenho</strong> em cada disciplina.</p>
    </div>

    <LoadingSpinner v-if="loading" message="Carregando dados..." />

    <div v-else>
      <div class="stats-row mt-lg">
        <StatsCard
          label="MÉDIA GERAL"
          :value="stats.mediaGeral"
          sub="Todas as disciplinas"
        />
        <StatsCard
          label="DISCIPLINAS"
          :value="stats.disciplinas"
          sub="Total de matérias matriculadas"
        />
        <StatsCard
          label="NOTAS PENDENTES"
          :value="stats.notasPendentes"
          sub="Notas a serem lançadas"
          color="var(--secondary)"
        />
      </div>

      <div v-if="boletim" class="mt-xl">
        <div class="flex items-center justify-between mb-lg">
          <h2 class="section-title">Meu Boletim</h2>
          <button
            class="btn btn-secondary"
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
                  <span class="badge" :class="situacaoBadge(d)">{{
                    situacao(d)
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { alunoService } from "@/api/services/aluno.service";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import type { BoletimResponse, DisciplinaNotas } from "@/api/types";
import StatsCard from "@/components/StatsCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const authStore = useAuthStore();
const toast = useToastStore();
const loading = ref(true);
const downloadingPdf = ref(false);
const boletim = ref<BoletimResponse | null>(null);

const stats = computed(() => {
  if (!boletim.value?.disciplinas?.length) {
    return { mediaGeral: "-", disciplinas: 0, notasPendentes: 0 };
  }

  const disciplinas = boletim.value.disciplinas;
  const mediasValidas: number[] = [];
  let notasPendentes = 0;

  disciplinas.forEach((d) => {
    const notasCount = d.notas.filter((n) => n.nota != null).length;
    if (notasCount < 2) {
      notasPendentes += 1;
    }
    const vals = d.notas.filter((n) => n.nota != null).map((n) => n.nota);
    if (vals.length > 0) {
      const media = vals.reduce((a, b) => a + b, 0) / vals.length;
      mediasValidas.push(media);
    }
  });

  const mediaGeral =
    mediasValidas.length > 0
      ? (mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length).toFixed(1)
      : "-";

  return {
    mediaGeral,
    disciplinas: disciplinas.length,
    notasPendentes,
  };
});

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
const situacao = (d: DisciplinaNotas) => {
  const notasCount = d.notas.filter((n) => n.nota != null).length;
  if (notasCount < 2) return "Pendente";
  const m = media(d);
  const n = parseFloat(m);
  return isNaN(n) ? "Pendente" : n >= 6 ? "Aprovado" : "Recuperação";
};
const situacaoBadge = (d: DisciplinaNotas) => {
  const notasCount = d.notas.filter((n) => n.nota != null).length;
  if (notasCount < 2) return "badge-secondary";
  const m = media(d);
  const n = parseFloat(m);
  return isNaN(n) ? "badge-secondary" : n >= 6 ? "badge-success" : "badge-danger";
};

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

onMounted(async () => {
  try {
    const boletimData = await alunoService.obterBoletim();
    boletim.value = boletimData;
  } catch {
    toast.error("Erro ao carregar dados");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.mt-xl {
  margin-top: 32px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0;
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
.badge-neutral {
  background: #f3f4f6;
  color: #6b7280;
}
.badge-secondary {
  background: #fed7aa;
  color: #92400e;
}
.text-success {
  color: #166534;
}
.text-danger {
  color: #991b1b;
}
.mb-lg {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
  }
}
</style>
