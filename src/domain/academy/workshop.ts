export type WorkshopVideo = {
  id: string;
  title: string;
  creator: string;
  language: 'Português' | 'Inglês' | 'Espanhol';
};

export const iwataCleaning = {
  title: 'Guia de limpeza da Iwata',
  creator: 'Iwata',
  url: 'https://www.iwata-airbrush.com/manuals/iwata_airbrush_cleaning_guide.pdf',
  format: 'PDF',
  language: 'Inglês',
  verifiedOn: '2026-11-26',
} as const;

export const wimpelManual = {
  title: 'Uso e limpeza do aerógrafo MP-1003',
  creator: 'Wimpel',
  url: 'https://www.wimpel.com.br/pdf/mp1003.pdf',
  format: 'PDF',
  language: 'Português',
  verifiedOn: '2026-11-26',
} as const;

export const condorBrushGuide = {
  title: 'Manual de pincéis: uso, limpeza e exercícios',
  creator: 'Condor',
  url: 'https://www.condor.ind.br/files/large/00b48d10fd516a1',
  format: 'PDF',
  language: 'Português',
  verifiedOn: '2026-11-26',
} as const;

export const benchGuides = [
  {
    id: 'primeira-pintura',
    title: 'Primeira pintura',
    videos: [
      {
        id: '56ffaBPd5m4',
        title: 'Como começar na pintura de miniaturas',
        creator: 'Pintando Miniaturas',
        language: 'Português',
      },
      {
        id: 'g9y_6VazAqg',
        title: 'Cinco passos fundamentais da pintura',
        creator: 'Pintando Miniaturas',
        language: 'Português',
      },
      {
        id: 'uTW49RW2WMM',
        title: 'Paleta úmida caseira',
        creator: 'Miniaturas Táticas',
        language: 'Português',
      },
    ],
  },
  {
    id: 'aerografo',
    title: 'Aerógrafo',
    pdf: iwataCleaning,
    videos: [
      {
        id: 'JQiF1a0MG4U',
        title: 'Primeiros passos com aerógrafo',
        creator: 'Pintando Miniaturas',
        language: 'Português',
      },
      {
        id: 'UqJIlcmJCZ4',
        title: 'Limpeza, vedação e lubrificação',
        creator: 'OG Miniaturas',
        language: 'Português',
      },
      {
        id: 'UhV1rybMP9Q',
        title: 'Demonstração de diluição para aerógrafo e pincel',
        creator: 'Artesanato Impresso 3D',
        language: 'Português',
      },
    ],
  },
  {
    id: 'pinceis',
    title: 'Pincéis',
    pdf: condorBrushGuide,
    videos: [
      {
        id: '7wbUf14PVjw',
        title: 'Limpeza e conservação dos pincéis',
        creator: 'Professor Lúdico',
        language: 'Português',
      },
    ],
  },
  {
    id: 'preparo',
    title: 'Lixamento e preparo',
    videos: [
      {
        id: 'P2ka3qzT4M0',
        title: 'Preparação, lixamento e preenchimento',
        creator: 'Loot Studios',
        language: 'Inglês',
      },
      {
        id: 'KxF8t6k39cE',
        title: 'Preparar e montar miniaturas antes da pintura',
        creator: 'Brushstroke Painting Guides',
        language: 'Inglês',
      },
    ],
  },
  {
    id: 'luz-e-sombra',
    title: 'Luz, sombra e texturas',
    videos: [
      {
        id: 'rVDOMVnJdd0',
        title: 'Luz, sombra e verniz em miniaturas de RPG',
        creator: 'Tenda Arcana',
        language: 'Português',
      },
      {
        id: 'lhIJQlVcwsc',
        title: 'Pincel seco com Acrilex e Decorfix',
        creator: 'Pintando Miniaturas',
        language: 'Português',
      },
    ],
  },
  {
    id: 'verniz',
    title: 'Verniz e proteção',
    videos: [
      {
        id: 'Q4tpccNvLnE',
        title: 'Aplicação de verniz em spray',
        creator: 'Mini Custom Rafa',
        language: 'Português',
      },
    ],
  },
  {
    id: 'retoques-e-bases',
    title: 'Retoques e bases',
    videos: [
      {
        id: 'DKIPS5N5f0E',
        title: 'Cinco erros de iniciante e como corrigi-los',
        creator: 'Lyla Mev - The Mini Witch',
        language: 'Inglês',
      },
      {
        id: 'VA5dRjrmIGg',
        title: 'Três bases simples para miniaturas',
        creator: 'Duncan Rhodes Painting Academy',
        language: 'Inglês',
      },
    ],
  },
] satisfies {
  id: string;
  title: string;
  videos: WorkshopVideo[];
  pdf?: { title: string; url: string };
}[];

const kitVideo = {
  id: 'l_2mVl3eYkk',
  title: 'Materiais básicos para pintar miniaturas',
  creator: 'ZukaVerso: Rpg e Boardgames',
  language: 'Português',
} satisfies WorkshopVideo;

export const kitVideos = [
  kitVideo,
  {
    id: 'SyJHZIdp-Yo',
    title: 'Guia rápido de materiais para iniciantes',
    creator: 'Pintando Miniaturas',
    language: 'Português',
  },
] satisfies WorkshopVideo[];

export const practiceVideoIds = [
  'Gcqhhwq6nHc',
  'lwJtzvME6KA',
  'CgOZihDQZeU',
  'uqFnsbE1Mr4',
];
