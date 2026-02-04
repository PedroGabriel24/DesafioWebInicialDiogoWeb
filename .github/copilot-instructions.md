<!-- Instruções para agentes AI que editam este repositório -->
# Copilot instructions — DesafioWebInicialDiogoWeb

Resumo curto
- Projeto Vite + React minimal: ponto de entrada em `src/main.jsx`, componente raiz em `src/App.jsx`.
- Build/Dev: `npm run dev`, `npm run build`, `npm run preview` (veja `package.json`).

Arquitetura e propósito
- Frontend estático single-page app criado com Vite; foco em UI/componentes estáticos (sem backend neste repositório).
- Estrutura principal: `src/` contém `assets/`, `components/` e `pages/` — coloque componentes reutilizáveis em `src/components` e views em `src/pages`.
- `public/` é para ativos estáticos servidos sem processamento pelo Vite.

Padrões de código e convenções do projeto
- Arquivos React usam extensão `.jsx` (ex.: `src/App.jsx`, `src/main.jsx`).
- Estilos locais: `src/index.css` e `src/App.css` já existentes; preferir CSS modular por arquivo dentro de `components/` se adicionar muitos estilos.
- Linter: `npm run lint` executa `eslint .` — siga regras ES Lint padrão já configuradas nas dependências.

Scripts e fluxo de desenvolvimento
- Dev: `npm run dev` — inicia servidor Vite para desenvolvimento.
- Build: `npm run build` — produção (gera `dist/`).
- Preview: `npm run preview` — serve a build localmente para ver o resultado de produção.
- Lint: `npm run lint` — rodar antes de abrir PRs.

Pontos importantes e exemplos práticos
- Entrada da app: [src/main.jsx](src/main.jsx#L1) — não mude sem atualizar o elemento `root` no `index.html`.
- Componente raiz: [src/App.jsx](src/App.jsx#L1) — local natural para montar rotas, providers (context, i18n) ou layout global.
- Para adicionar uma nova página: crie `src/pages/NomeDaPagina.jsx` e exporte como componente; importe em `src/App.jsx` se necessário.
- Imagens/ícones estáticos grandes: adicione em `public/` para evitar import bundling quando apropriado.

Integrações e dependências notáveis
- Dependências declaradas em `package.json`: React 19, Vite; plugins Vite React em `devDependencies`.
- Não há integração de backend ou API definida neste repositório — qualquer chamada externa deve ser documentada no código ou em novo README.

Futura integração com API e banco de dados (orientações práticas)
- Organização: coloque o cliente HTTP e as chamadas de API em `src/services/` (ex.: `src/services/api.js`).
- Variáveis de ambiente: use `VITE_API_BASE_URL` e `VITE_API_KEY` em `.env` (acessíveis via `import.meta.env.VITE_API_BASE_URL`).
- Exemplo mínimo de cliente (fetch):

	```js
	// src/services/api.js
	const BASE = import.meta.env.VITE_API_BASE_URL || '';
	export async function getResource(path) {
		const res = await fetch(`${BASE}/${path}`, { credentials: 'include' });
		if (!res.ok) throw new Error(await res.text());
		return res.json();
	}
	```

- CORS e proxy: durante dev, configure proxy em `vite.config.js` para evitar CORS e apontar para o backend local. No production, o backend deve lidar com CORS corretamente.
- Autenticação: prefira tokens curtos e renováveis; guarde tokens sensíveis em cookies httpOnly quando possível (segurança do lado servidor) e não em localStorage se houver risco de XSS.
- Mocks e testes: adicionar `src/mocks/` ou usar `msw` para simular a API em dev/testes antes do backend estar pronto.
- Migrações e contratos: documente endpoints esperados (rota, método, corpo e forma da resposta) em `docs/api.md` ou no README do `src/services` antes de integrar.

Regras práticas para PRs automáticos gerados por agentes
- Mantenha mudanças pequenas e focadas (1 recurso/bugfix por PR).
- Execute `npm run lint` localmente; inclua correções de lint apenas se diretamente relacionadas.
- Atualize `src/App.jsx` apenas para registrar providers/rotas; evite reescrever a estrutura básica sem nota explicativa no PR.
- Adicione testes ou instruções para testar manualmente quando a alteração afetar comportamento visível.

Onde checar antes de propor mudanças
- Verifique `package.json` para scripts e versões.
- Consulte `index.html` (raiz) se alterar pontos de montagem ou head/meta (assets/Vite).

Perguntas abertas para o mantenedor
- Deseja padrão de roteamento (React Router) pré-instalado? Onde preferem localizar estados globais (Context vs lib externa)?

Fim.
