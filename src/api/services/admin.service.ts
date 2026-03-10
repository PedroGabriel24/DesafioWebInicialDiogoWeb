import api from "@/api/axios";
import type {
  UsersRequest,
  UsersUpdateRequest,
  UsersResponse,
  ProfessorMateriaSerieRequest,
  ProfessorMateriaSerieResponse,
  AlunoSerieRequest,
  AlunoSerieResponse,
  MateriaRequest,
  MateriaResponse,
  SerieRequest,
  SerieResponse,
  SerieMateriaRequest,
  SerieMateriaResponse,
  ProfessorMateriasSeriesResponse,
} from "@/api/types";

export const adminService = {
  async listarUsuarios(): Promise<UsersResponse[]> {
    const { data } = await api.get<UsersResponse[]>("/admin/usuarios");
    return data;
  },

  async obterUsuarioPorId(id: number): Promise<UsersResponse> {
    const { data } = await api.get<UsersResponse>(`/admin/usuarios/${id}`);
    return data;
  },

  async criarUsuario(params: UsersRequest): Promise<UsersResponse> {
    const { data } = await api.post<UsersResponse>("/admin/cadastro", params);
    return data;
  },

  async atualizarUsuario(
    id: number,
    params: UsersUpdateRequest,
  ): Promise<UsersResponse> {
    const { data } = await api.put<UsersResponse>(
      `/admin/usuarios/${id}`,
      params,
    );
    return data;
  },

  async deletarUsuario(id: number): Promise<string> {
    const { data } = await api.delete<string>(`/admin/usuarios/${id}`);
    return data;
  },

  async adicionarProfessorASerie(
    params: ProfessorMateriaSerieRequest,
  ): Promise<ProfessorMateriaSerieResponse> {
    const { data } = await api.post<ProfessorMateriaSerieResponse>(
      "/admin/professores/series",
      params,
    );
    return data;
  },

  async adicionarAlunoASerie(
    params: AlunoSerieRequest,
  ): Promise<AlunoSerieResponse> {
    const { data } = await api.post<AlunoSerieResponse>(
      "/admin/alunos/series",
      params,
    );
    return data;
  },

  async listarMaterias(): Promise<MateriaResponse[]> {
    const { data } = await api.get<MateriaResponse[]>("/admin/materias");
    return data;
  },
  async obterMateriaPorId(id: number): Promise<MateriaResponse> {
    const { data } = await api.get<MateriaResponse>(`/admin/materias/${id}`);
    return data;
  },
  async criarMateria(params: MateriaRequest): Promise<MateriaResponse> {
    const { data } = await api.post<MateriaResponse>("/admin/materias", params);
    return data;
  },
  async atualizarMateria(
    id: number,
    params: MateriaRequest,
  ): Promise<MateriaResponse> {
    const { data } = await api.put<MateriaResponse>(
      `/admin/materias/${id}`,
      params,
    );
    return data;
  },
  async deletarMateria(id: number): Promise<string> {
    const { data } = await api.delete<string>(`/admin/materias/${id}`);
    return data;
  },

  async listarSeries(): Promise<SerieResponse[]> {
    const { data } = await api.get<SerieResponse[]>("/admin/series");
    return data;
  },
  async obterSeriePorId(id: number): Promise<SerieResponse> {
    const { data } = await api.get<SerieResponse>(`/admin/series/${id}`);
    return data;
  },
  async criarSerie(params: SerieRequest): Promise<SerieResponse> {
    const { data } = await api.post<SerieResponse>("/admin/series", params);
    return data;
  },
  async atualizarSerie(
    id: number,
    params: SerieRequest,
  ): Promise<SerieResponse> {
    const { data } = await api.put<SerieResponse>(
      `/admin/series/${id}`,
      params,
    );
    return data;
  },
  async deletarSerie(id: number): Promise<string> {
    const { data } = await api.delete<string>(`/admin/series/${id}`);
    return data;
  },

  async criarSerieMateria(
    params: SerieMateriaRequest,
  ): Promise<SerieMateriaResponse> {
    const { data } = await api.post<SerieMateriaResponse>(
      "/admin/series-materias",
      params,
    );
    return data;
  },
  async deletarSerieMateria(id: number): Promise<string> {
    const { data } = await api.delete<string>(`/admin/series-materias/${id}`);
    return data;
  },

  async deletarProfessorMateriaSerie(id: number): Promise<string> {
    const { data } = await api.delete<string>(
      `/admin/professor-materias-series/${id}`,
    );
    return data;
  },

  async listarProfessorMateriasSeries(): Promise<ProfessorMateriasSeriesResponse[]> {
    const { data } = await api.get<ProfessorMateriasSeriesResponse[]>(
      "/admin/professores-materias-series",
    );
    return data;
  },

  async listarSerieMateriasPorSerie(
    serieId: number,
  ): Promise<SerieMateriaResponse[]> {
    const { data } = await api.get<SerieMateriaResponse[]>(
      `/admin/series/${serieId}/materias`,
    );
    return data;
  },

  async listarSerieMateriasPorMateria(
    materiaId: number,
  ): Promise<SerieMateriaResponse[]> {
    const { data } = await api.get<SerieMateriaResponse[]>(
      `/admin/materias/${materiaId}/series`,
    );
    return data;
  },
};
