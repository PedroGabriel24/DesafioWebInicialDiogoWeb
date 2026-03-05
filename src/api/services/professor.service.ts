import api from "@/api/axios";
import type {
  LancarNotaRequest,
  ObservacoesRequest,
  ObservacoesResponse,
} from "@/api/types";

export const professorService = {
  async getDashboard(): Promise<Record<string, any>> {
    const { data } = await api.get<Record<string, any>>("/professor/dashboard");
    return data;
  },

  async getAlunosPorMateria(idMateria: number): Promise<any> {
    const { data } = await api.get<any>(
      `/professor/alunos-por-materia/${idMateria}`,
    );
    return data;
  },

  async lancarNota(params: LancarNotaRequest): Promise<string> {
    try {
      const { data } = await api.post<string>("/professor/notas", params);
      return data;
    } catch (err: any) {
      if (err.response?.status === 500 || err.response?.status === 409) {
        const { data } = await api.put<string>("/professor/notas", params);
        return data;
      }
      throw err;
    }
  },

  async alterarNota(params: LancarNotaRequest): Promise<string> {
    const { data } = await api.put<string>("/professor/notas", params);
    return data;
  },

  async listarObservacoes(): Promise<ObservacoesResponse[]> {
    const { data } = await api.get<ObservacoesResponse[]>(
      "/professor/observacoes",
    );
    return data;
  },

  async adicionarObservacao(params: ObservacoesRequest): Promise<string> {
    const { data } = await api.post<string>("/professor/observacoes", params);
    return data;
  },
};
