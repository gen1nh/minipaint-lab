import { wimpelManual } from './workshop';

type Product = { name: string; source?: string };
type Material = {
  name: string;
  economical: Product;
  upgrade: Product;
  note?: string;
};

type Stage = {
  id: string;
  title: string;
  skills: string[];
  checkpoint: string;
  materials: Material[];
  lesson: { title: string; path: string };
  optional?: boolean;
};

export const materialRoadmap: Stage[] = [
  {
    id: 'preparo',
    title: 'Preparar a peça',
    lesson: {
      title: 'Assistir à aula de preparação e primer',
      path: 'cursos/fundamentos/prep',
    },
    skills: [
      'Identificar o material da miniatura',
      'Remover marcas sem apagar detalhes',
      'Aplicar primer compatível em camada fina',
    ],
    checkpoint:
      'A peça está limpa, sem pó, e o primer seco cobre a superfície sem esconder a textura.',
    materials: [
      {
        name: 'Peça para praticar',
        economical: { name: 'Miniatura plástica simples ou peça de teste' },
        upgrade: { name: 'Miniatura já preparada para pintura' },
        note: 'Prefira uma peça com áreas grandes. Uma peça já preparada permite seguir direto para o pincel.',
      },
      {
        name: 'Lixa fina, se houver marcas',
        economical: {
          name: 'Norton Lixa d’Água T223',
          source:
            'https://www.nortonabrasives.com/pt-br/folha-de-lixa-dagua-t223',
        },
        upgrade: {
          name: 'Tamiya Sanding Sponge Sheet 1000',
          source: 'https://www.tamiya.com/english/products/87149/index.html',
        },
        note: 'Escolha a granulação conforme a superfície. Em resina, siga a pós-cura e o controle de pó indicados pelo fabricante.',
      },
      {
        name: 'Primer, se a peça estiver crua',
        economical: {
          name: 'Acrilex Primer para Metais, PET e Vidro',
          source:
            'https://acrilex.com.br/produto/primer-para-metais-pet-e-vidro/',
        },
        upgrade: {
          name: 'Vallejo Surface Primer Grey',
          source:
            'https://acrylicosvallejo.com/wp-content/uploads/2025/10/Catalogo_2026-R02.pdf',
        },
        note: 'O Acrilex é indicado para metais, PET e vidro. Para plástico de outro tipo ou resina, confira a indicação do primer e teste num retalho.',
      },
    ],
  },
  {
    id: 'primeira-pintura',
    title: 'Pintar a pincel',
    lesson: {
      title: 'Assistir à aula de controle do pincel',
      path: 'cursos/fundamentos/brush-control',
    },
    skills: [
      'Controlar a carga do pincel',
      'Ajustar a consistência da tinta',
      'Aplicar cor-base sem cobrir os detalhes',
    ],
    checkpoint:
      'Você consegue aplicar uma cor uniforme em camadas finas, sem poças nos recessos.',
    materials: [
      {
        name: 'Pincel redondo com boa ponta',
        economical: {
          name: 'Condor Pincel Artístico Redondo 4415',
          source:
            'https://www.condor.ind.br/produto/pintura-artistica/pincel-artistico-redondo-4415',
        },
        upgrade: {
          name: 'The Army Painter Hobby Starter Brush Set',
          source:
            'https://thearmypainter.com/products/brushes-hobby-starter-brush-set-tl5067p',
        },
        note: 'Um bom redondo já cobre a maior parte da primeira pintura.',
      },
      {
        name: 'Tintas acrílicas',
        economical: {
          name: 'Corfix Decorfix Fosca',
          source:
            'https://www.corfix.com.br/wp-content/uploads/2016/11/Tintas-Acrilicas-Decorativas-CORFIX.pdf',
        },
        upgrade: {
          name: 'The Army Painter Warpaints Fanatic Starter Set',
          source:
            'https://thearmypainter.com/products/warpaints-fanatic-warpaints-fanatic-starter-set-wp8066p',
        },
        note: 'Comece com branco, preto, a cor principal da peça e uma de destaque. Teste a tinta artesanal em uma área preparada. O Starter Set já inclui pincel, miniatura e primer para pincel.',
      },
      {
        name: 'Paleta e limpeza',
        economical: { name: 'Pires branco, copo de água e papel absorvente' },
        upgrade: {
          name: 'The Army Painter Wet Palette',
          source:
            'https://thearmypainter.com/products/tools-wet-palette-tl5051p',
        },
        note: 'Use água ou o diluente indicado pela tinta. A paleta úmida é um upgrade para sessões mais longas.',
      },
      {
        name: 'Iluminação da bancada',
        economical: { name: 'Luminária que você já tem ou luz de janela' },
        upgrade: { name: 'Luminária de mesa ajustável com luz neutra' },
      },
    ],
  },
  {
    id: 'acabamento',
    title: 'Luz, sombra e acabamento',
    lesson: {
      title: 'Assistir à aula de luz e sombra',
      path: 'cursos/cel/values',
    },
    skills: [
      'Separar sombra, base e luz',
      'Fazer linhas e retoques com controle',
      'Escolher entre borda chapada e transição suave',
    ],
    checkpoint:
      'Dá para distinguir os volumes à distância, e você consegue repetir a mesma marca em uma peça de teste.',
    materials: [
      {
        name: 'Ponta fina para detalhes',
        economical: {
          name: 'O seu pincel redondo, se a ponta estiver íntegra',
        },
        upgrade: {
          name: 'Winsor & Newton Series 7 Miniature',
          source:
            'https://www.winsornewton.com/products/series-7-kolinsky-sable-brush-series-7-kolinsky-sable-mintature-painting-brush-round',
        },
      },
      {
        name: 'Paleta para misturar tons',
        economical: { name: 'Pires branco e as tintas da primeira pintura' },
        upgrade: {
          name: 'Redgrass Everlasting Wet Palette',
          source: 'https://www.redgrasscreative.com/category/wet-palette/',
        },
      },
    ],
  },
  {
    id: 'aerografo',
    title: 'Aerógrafo',
    lesson: { title: 'Ver vídeos de aerógrafo e limpeza', path: 'dicas/aerografo' },
    optional: true,
    skills: [
      'Regular o fluxo e testar a pulverização em cartão',
      'Ajustar diluição conforme a linha de tinta',
      'Limpar entre cores e após a sessão',
    ],
    checkpoint:
      'Você consegue fazer pontos e faixas uniformes no cartão e limpar o equipamento conforme o manual.',
    materials: [
      {
        name: 'Aerógrafo de dupla ação',
        economical: {
          name: 'Wimpel MP-1003',
          source: wimpelManual.url,
        },
        upgrade: {
          name: 'Iwata Eclipse HP-CS',
          source: 'https://www.iwata-airbrush.com/airbrushes.html',
        },
        note: 'Inclua as peças de reposição no orçamento. O NEO for Iwata CN é outra opção de entrada para comparar.',
      },
      {
        name: 'Compressor e mangueira',
        economical: {
          name: 'Compressor de bancada com regulador, filtro de umidade e mangueira compatível',
        },
        upgrade: {
          name: 'Iwata Smart Jet Pro',
          source: 'https://www.iwata-airbrush.com/iwata-smart-jet-pro.html',
        },
        note: 'Confira a tensão, as conexões e o que acompanha o compressor antes de comprar.',
      },
      {
        name: 'Tinta, diluente e limpador',
        economical: {
          name: 'Tinta própria para aerógrafo e diluente e limpador indicados pelo fabricante',
        },
        upgrade: {
          name: 'Vallejo Model Air e Airbrush Thinner 71.161',
          source:
            'https://acrylicosvallejo.com/wp-content/uploads/2025/10/Catalogo_2026-R02.pdf',
        },
        note: 'Inclua o limpador compatível. Não use a proporção de uma marca como regra para outra.',
      },
      {
        name: 'Área de aplicação e proteção',
        economical: {
          name: 'Área de aplicação e proteção conforme a ficha de segurança do produto',
        },
        upgrade: {
          name: 'Cabine com exaustão externa, compatível com a tinta usada',
        },
        note: 'A cabine não substitui os demais cuidados indicados na ficha de segurança.',
      },
    ],
  },
];
