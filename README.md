# Plataforma DiogoWeb

Plataforma de gestão escolar desenvolvida em **Vue 3** com **Vite**, focada em fornecer uma interface rápida e reativa para administradores, professores e alunos.

Este projeto consome uma API RESTful para gerenciar usuários, turmas, matérias, notas e observações, com suporte a fluxos específicos dependendo do tipo de usuário logado.

---

## 🚀 Tecnologias e Bibliotecas

Este projeto foi construído utilizando as seguintes ferramentas:

- **[Vue 3](https://vuejs.org/)** (Composition API) - Framework progressivo para construção de interfaces de usuário.
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rápida.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript com tipagem estática.
- **[Pinia](https://pinia.vuejs.org/)** - Gerenciador de estado moderno para Vue.
- **[Vue Router](https://router.vuejs.org/)** - Roteamento oficial do Vue.
- **[Axios](https://axios-http.com/)** - Cliente HTTP baseado em Promise para chamadas na API.

---

## 📂 Estrutura do Projeto

A arquitetura do projeto foi pensada para ser modular e escalável:

```text
src/
├── api/          # Configuração do Axios, definição de types e services (services abstraem chamadas à API)
├── assets/       # Estilos globais (CSS) e imagens/ícones estáticos
├── components/   # Componentes Vue genéricos e reutilizáveis (botões, modais, spinners, etc.)
├── layouts/      # Componentes de layout (Sidebars, Menus Superiores)
├── modules/      # Divisão por escopo da aplicação (admin, professor, aluno) com suas próprias views e lógicas
├── router/       # Configuração de rotas da aplicação, incluindo proteção de rotas (Navigation Guards)
├── stores/       # Stores do Pinia para gerenciamento de estado global (auth, toasts, etc.)
├── views/        # Páginas principais que agregam componentes
├── App.vue       # Root component
└── main.ts       # Ponto de entrada da aplicação (instanciação do Vue, Pinia, Router)
```

---

## 🛠️ Configuração e Instalação

Para rodar este projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada: v18+ ou v20+)
- NPM, Yarn ou pnpm configurados na máquina.

### Passos

1. **Clone o repositório** (se aplicável) e acesse o diretório do projeto:

   ```bash
   cd WebDiogoWeb
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   > A aplicação estará rodando tipicamente em `http://localhost:5173`.

4. **Para gerar o build de produção:**
   ```bash
   npm run build
   ```
   Isso rodará a verificação de tipos (`vue-tsc -b`) seguido pelo `vite build`. Os arquivos finais ficarão na pasta `dist/`.

---

## 🛡️ Autenticação e Perfis

O sistema baseia-se em **tokens JWT**. A interligação com a API permite 3 perfis principais, controlando quais rotas/módulos podem ser acessados:

- **ADMIN**: Gestão completa de usuários, matérias, séries e associações de professores.
- **PROFESSOR**: Dashboard focado na visualização de alunos por matérias, inclusão e edição de notas (`Lançamento de Notas`) e registro de observações comportamentais.
- **ALUNO**: Consulta de matérias matriculadas, leitura de boletim escolar (com opção de gerar PDF) e vizualização de observações.

_A manipulação do token é feita através dos Interceptors do Axios (`src/api/axios.ts`) e o controle de estado do login reside nas stores de Autenticação (`src/stores/`)._

---

## 📝 Scripts Disponíveis

No arquivo `package.json`, os seguintes scripts podem ser utilizados:

- `npm run dev` - Roda o servidor de desenvolvimento (Vite).
- `npm run build` - Faz a compilação do TypeScript e gera o build otimizado da aplicação.
- `npm run preview` - Inicia um servidor estático simples para visualizar localmente o resultado da pasta `dist/`.
