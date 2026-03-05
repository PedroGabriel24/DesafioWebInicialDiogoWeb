export interface AuthRequestParams {
  email: string;
  senha: string;
}

export interface UsersRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  tipo: string;
  telefone: string;
  nascimento: string;
}

export interface UsersUpdateRequest {
  nome?: string;
  email?: string;
  senha?: string;
  cpf?: string;
  tipo?: string;
  telefone?: string;
  nascimento?: string;
  status?: string;
}

export interface UsersResponse {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  status: string;
  cadastro: string;
}

export interface ProfessorMateriaSerieRequest {
  professorId: number;
  materiaId: number;
  serieId: number;
}
export interface ProfessorMateriaSerieResponse {
  id: number;
  professorId: number;
  professorNome: string;
  materiaId: number;
  materiaNome: string;
  serieId: number;
  serieNome: string;
}

export interface AlunoSerieRequest {
  alunoId: number;
  serieId: number;
}
export interface AlunoSerieResponse {
  id: number;
  alunoId: number;
  alunoNome: string;
  serieId: number;
  serieNome: string;
}

export interface SerieRequest {
  nome: string;
}
export interface SerieResponse {
  id: number;
  nome: string;
}

export interface MateriaRequest {
  nome: string;
}
export interface MateriaResponse {
  id: number;
  nome: string;
}

export interface SerieMateriaRequest {
  serieId: number;
  materiaId: number;
}
export interface SerieMateriaResponse {
  id: number;
  serieId: number;
  serieNome: string;
  materiaId: number;
  materiaNome: string;
}

export interface LancarNotaRequest {
  alunoSerieId: number;
  materiaId: number;
  periodoId: number;
  nota: number;
}
export interface PeriodoNota {
  periodoId: number;
  periodoNome: string;
  nota: number;
}
export interface DisciplinaNotas {
  materiaId: number;
  materiaNome: string;
  notas: PeriodoNota[];
}
export interface BoletimResponse {
  alunoId: number;
  alunoNome: string;
  disciplinas: DisciplinaNotas[];
}

export interface ObservacoesResponse {
  nome: string;
  mensagem: string;
  status: string;
  data: string;
}

export interface ObservacoesRequest {
  mensagem: string;
  alunoId: number;
  status: string;
}

export interface JwtPayloadExtras {
  tipo: string;
  serie: string;
  materia: string;
}
export interface JwtPayloadInner {
  userId: string;
  name: string;
  email: string;
  profile: string;
  extras: JwtPayloadExtras[];
}
export interface JwtPayload {
  sub: string;
  payload: JwtPayloadInner;
  exp: number;
  iat: number;
}

export type UserRole = "ADMIN" | "PROFESSOR" | "ALUNO";
