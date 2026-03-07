export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Header
    appTitle: 'Visão Global',
    appSubtitle: 'Clique em um país para explorar suas informações',
    langTooltip: "Trocar idioma para Inglês", 

    // CountryInfo panel
    panelClose: 'Fechar painel',
    sectionGeneral: 'Geral',
    sectionEconomy: 'Economia',
    sectionStates: 'Estados / Províncias',
    labelCapital: 'Capital',
    labelRegion: 'Região',
    labelSubregion: 'Sub-região',
    labelNative: 'Idioma nativo',
    labelCurrency: 'Moeda',
    labelPhone: 'Telefone',
    labelFlag: 'Bandeira',
    statesMore: (n: number) => `+${n} mais…`,
    loadingGlobe: 'Carregando globo…',
    loadingCountry: 'Buscando informações…',
    loadingCities: 'Carregando cidades…',
    errorGeo: 'Falha ao carregar dados geográficos.',
    errorCountry: 'Não foi possível carregar os dados do país.',
    errorState: 'Não foi possível carregar as cidades do estado.',
    search: 'Pesquisar…',

    // StateView
    backToGlobe: 'Voltar ao globo',
    stateCities: 'Cidades',
    noCities: 'Nenhuma cidade encontrada.',
    mapHint: 'Mapa das cidades',
  },
  en: {
    appTitle: 'Global Insight',
    appSubtitle: 'Click on a country to explore its information',
    langTooltip: "Switch language to Portuguese",

    panelClose: 'Close panel',
    sectionGeneral: 'General',
    sectionEconomy: 'Economy',
    sectionStates: 'States / Provinces',
    labelCapital: 'Capital',
    labelRegion: 'Region',
    labelSubregion: 'Subregion',
    labelNative: 'Native language',
    labelCurrency: 'Currency',
    labelPhone: 'Phone',
    labelFlag: 'flag',
    statesMore: (n: number) => `+${n} more…`,
    loadingGlobe: 'Loading globe…',
    loadingCountry: 'Fetching information…',
    loadingCities: 'Loading cities…',
    errorGeo: 'Failed to load geographic data.',
    errorCountry: 'Could not load country data.',
    errorState: 'Could not load state cities.',
    search: 'Search…',

    backToGlobe: 'Back to globe',
    stateCities: 'Cities',
    noCities: 'No cities found.',
    mapHint: 'City map',
  },
} as const;

export type Translations = (typeof translations)[Language];
