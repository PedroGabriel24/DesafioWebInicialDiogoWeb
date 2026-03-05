import api from "@/api/axios";
import type { ObservacoesResponse } from "@/api/types";

export const alunoService = {
  async listarMaterias(): Promise<any[]> {
    const { data } = await api.get<any[]>("/aluno/materias");
    return data;
  },

  async obterBoletim(): Promise<any> {
    const { data } = await api.get<any>("/aluno/boletim");
    return data;
  },

  async baixarBoletimPdf(): Promise<Blob> {
    const { data } = await api.get<Blob>("/aluno/boletim/pdf", {
      responseType: "blob",
    });
    return data;
  },

  async listarObservacoes(): Promise<ObservacoesResponse[]> {
    const { data } = await api.get<ObservacoesResponse[]>("/aluno/observacoes");
    return data;
  },
};
