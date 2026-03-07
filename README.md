# 🌍 Global Insight

**Global Insight** é um projeto pessoal de estudos em desenvolvimento front-end moderno. A ideia foi criar algo visualmente interessante enquanto praticava React, TypeScript, Canvas API e consumo de APIs — tudo junto num lugar só. Você pode explorar o globo em 3D, clicar em países, navegar por estados e visualizar cidades num mapa interativo.

---

## 🎯 Objetivo

Esse projeto nasceu da vontade de ir além dos tutoriais e construir algo real. Os principais focos de aprendizado foram:

- 🧩 Fundamentos e boas práticas com **React + TypeScript**
- 🔌 Consumo de **APIs REST** com tratamento de loading, dados e erros
- 🧵 Separação de responsabilidades com **Custom Hooks** e **Context API**
- 🗺️ Renderização de mapas com a **Canvas API**
- 🌐 Visualização 3D no browser com **WebGL / Three.js**
- 🎨 Interface responsiva com **CSS puro**, sem frameworks de UI
- 🌎 **Internacionalização (i18n)** com suporte a múltiplos idiomas

---

## ✨ Funcionalidades

- 🌍 Globo 3D interativo — gire com o mouse ou toque na tela
- 🏳️ Clique num país e veja nome, capital, moeda, estados e cidades
- 🗺️ Mapa 2D dos estados, desenhado na Canvas API
- 📍 Clique numa cidade para destacá-la no mapa
- 🔍 Zoom no mapa via rolagem do mouse
- 🔎 Busca e filtragem de cidades por nome
- 🌐 Troca de idioma em tempo real
- 📱 Layout responsivo para diferentes tamanhos de tela

---

## 🧠 O que aprendi / Conceitos estudados

### ⚛️ React e Arquitetura de Componentes
- Componentes com responsabilidade única e composição limpa
- `useEffect`, `useRef`, `useState` e outros hooks nativos
- **Custom Hooks** (`useCountryData`, `useStateData`, `useGeoData`) para isolar lógica de negócio
- Estado global com **Context API** (`LanguageContext`)

### 🔷 TypeScript
- Tipagem de props, estados e retornos de funções
- Interfaces e tipos customizados em `src/types/index.ts`
- Generics e union types para um código mais seguro

### 🔌 Consumo de APIs REST
- Requisições HTTP com **Axios**
- Camada de serviço desacoplada (`httpClient.ts`, `cscApi.ts`)
- Tratamento de estados: loading, sucesso e erro
- Variáveis de ambiente (`VITE_CSC_API_KEY`) para proteger credenciais

### 🖼️ Canvas API
- Renderização 2D de mapas a partir de coordenadas geográficas
- Projeção de lat/lng para pixels com padding adaptativo
- Zoom com transformações de contexto (`ctx.scale`, `ctx.translate`)
- Redesenho reativo com `ResizeObserver` + `requestAnimationFrame`

### 🌐 Renderização 3D com WebGL
- [`react-globe.gl`](https://github.com/vasturiano/react-globe.gl) sobre **Three.js** e **WebGL**
- Dados geográficos no formato **GeoJSON**
- Interação com polígonos 3D para seleção de países

### 🌎 Internacionalização (i18n)
- Traduções centralizadas em `src/i18n/translations.ts`
- Troca dinâmica de idioma via Context API, sem recarregar a página

### 🎨 CSS Puro
- Layout responsivo com **Flexbox**
- Animações e transições nativas
- Scroll independente por painel, sobreposições e efeitos visuais — tudo sem biblioteca

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Pra que serve |
|---|---|---|
| React | 19 | Biblioteca de interface |
| TypeScript | 5.9 | Tipagem estática |
| Vite | 7 | Bundler e dev server |
| react-globe.gl | 2.37 | Globo 3D com WebGL / Three.js |
| Axios | 1.13 | Requisições HTTP |
| react-icons | 5.6 | Ícones SVG |
| CSS Puro | — | Estilização e responsividade |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- Conta gratuita na [CountryStateCity API](https://app.countrystatecity.in)

---

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd Global-Insight
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a chave de API:**

   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_CSC_API_KEY=sua_chave_aqui
   ```
   > Gere a chave gratuitamente em [app.countrystatecity.in](https://app.countrystatecity.in).

4. **Rode o projeto:**
   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:5173](http://localhost:5173) ✨

---

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── flags/                  # Bandeiras nacionais
├── components/
│   ├── CountryInfo/            # Painel de detalhes do país
│   ├── GlobeComponent/         # Globo 3D interativo
│   ├── LoadingSpinner/         # Indicador de carregamento
│   ├── Starfield/              # Fundo animado com estrelas (Canvas)
│   └── StateView/              # Mapa 2D de estados + lista de cidades
├── contexts/
│   └── LanguageContext.tsx     # Estado global de idioma
├── hooks/
│   ├── useCountryData.ts       # Dados de países
│   ├── useGeoData.ts           # Dados GeoJSON
│   └── useStateData.ts         # Estados e cidades
├── i18n/
│   └── translations.ts         # Strings de tradução
├── services/
│   ├── cscApi.ts               # Chamadas à API CountryStateCity
│   └── httpClient.ts           # Instância configurada do Axios
├── types/
│   └── index.ts                # Tipos e interfaces TypeScript
├── App.tsx                     # Componente raiz
└── main.tsx                    # Ponto de entrada
```

---

## 💬 Considerações Finais

Esse projeto foi feito 100% para aprendizado — não tem fins comerciais. Se quiser trocar uma ideia sobre o código ou sugerir melhorias, fique à vontade! 🙌

> O uso da API CountryStateCity respeita os limites e termos em [app.countrystatecity.in](https://app.countrystatecity.in).
