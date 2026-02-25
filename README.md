# Globe Explorer 🌍

Visualize o globo terrestre em 3D e explore informações de todos os países do mundo, consumindo a API CountryStateCity.

## Demonstração

- Clique em qualquer país para ver detalhes (nome, capital, moeda, estados/províncias, etc).
- O globo pode ser girado livremente com o mouse/touch.

## Tecnologias Utilizadas

- **Linguagem:** TypeScript (React)
- **Framework:** Vite
- **3D Globe:** [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- **HTTP Client:** axios
- **Estilo:** CSS puro (App.css)

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd nome-do-projeto
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure a API Key:**
   - Crie uma conta gratuita em https://app.countrystatecity.in
   - Gere uma API Key no dashboard
   - Copie `.env.example` para `.env` e preencha sua chave:
     ```env
     VITE_CSC_API_KEY=sua_chave_aqui
     ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
5. Acesse [http://localhost:5173](http://localhost:5173)

## Estrutura dos principais arquivos

- `src/components/GlobeComponent.tsx` — Globo 3D interativo
- `src/components/CountryInfo.tsx` — Painel lateral com detalhes do país
- `src/services/cscApi.ts` — Consumo da API CountryStateCity
- `src/types/index.ts` — Tipos TypeScript para países, estados, cidades e GeoJSON
- `src/App.tsx` — Componente principal
- `src/App.css` — Estilos customizados

## Licença

Projeto para fins de estudo. API gratuita, consulte limites em https://app.countrystatecity.in
