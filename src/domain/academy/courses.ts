import { condorBrushGuide, iwataCleaning, wimpelManual } from './workshop';

type Lesson = {
  id: string;
  title: string;
  tool?: 'primer' | 'mixer' | 'shading';
  colors?: string[];
  video?: CuratedVideo;
  resources?: Resource[];
};
type Resource = {
  title: string;
  creator: string;
  url: string;
  format: 'PDF';
  language: 'Inglês' | 'Português';
  verifiedOn: string;
};
type CuratedVideo = {
  id: string;
  creator: string;
  title: string;
  language: 'pt-BR' | 'en' | 'it';
  level: 'iniciante' | 'intermediário';
  verifiedOn: string;
};
const verifiedOn = '2026-11-26';
const lexicon: Resource = {
  title: 'Painting Techniques and Results Lexicon',
  creator: 'Warhammer Community',
  url: 'https://assets.warhammer-community.com/eng_hobby-hangout-zc9pb6pzsz-4nwupcj1la.pdf',
  format: 'PDF',
  language: 'Inglês',
  verifiedOn,
};
export type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  coverLesson: string;
  lessons: Lesson[];
};
export const courses: Course[] = [
  {
    id: 'fundamentos',
    coverLesson: 'first-mini',
    title: 'Fundamentos da pintura',
    description: 'Prepare a peça, aplique a cor-base e revise a pintura.',
    level: 'Iniciante',
    lessons: [
      {
        id: 'prep',
        title: 'Preparação e primer',
        tool: 'primer',
        resources: [
          {
            title: 'Warhammer Alliance Leaders’ Guide',
            creator: 'Warhammer Alliance',
            url: 'https://warhammer-alliance.com/wp-content/uploads/sites/16/2024/09/ENG_Warhammer_Alliance_Leaders_Guide_2024.pdf',
            format: 'PDF',
            language: 'Inglês',
            verifiedOn,
          },
        ],
        video: {
          id: 'OvpjKfada40',
          creator: 'Pintando Miniaturas',
          title: 'Como preparar suas miniaturas plásticas (+Primer Spray)',
          language: 'pt-BR',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'brush-control',
        title: 'Controle do pincel',
        video: {
          id: 'Gcqhhwq6nHc',
          creator: 'Dana Howl',
          title:
            'Better Brush Control is Easy with these 3 Principles: Wetness, Thickness & Texture',
          language: 'en',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'base',
        title: 'Camadas de base',
        tool: 'mixer',
        video: {
          id: 'lwJtzvME6KA',
          creator: 'Pintando Miniaturas',
          title: 'Diluição de Tinta para Pincel: Do Básico ao Avançado',
          language: 'pt-BR',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'wash',
        title: 'Sombras nos recessos',
        video: {
          id: 'mADYQQOH9a8',
          creator: 'Brushstroke Painting Guides',
          title: 'How To Use Washes & Shades: A Step-By-Step Guide',
          language: 'en',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'drybrush',
        title: 'Luzes com pincel seco',
        video: {
          id: 'kxuY2NXeI2M',
          creator: 'Artis Opus',
          title: 'DRYBRUSHING: A COMPLETE GUIDE',
          language: 'en',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'first-mini',
        title: 'Pinte sua primeira miniatura',
        video: {
          id: 'UQfAyfMc6xs',
          creator: 'Squidmar Miniatures',
          title: 'Painting your first ever miniature? Start here!',
          language: 'en',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'basing',
        title: 'Acabamento da base',
        video: {
          id: 'wMtw_bykGMU',
          creator: 'Pintando Miniaturas',
          title: 'Como fazer a base da miniatura com MATERIAIS NACIONAIS',
          language: 'pt-BR',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'finish',
        resources: [lexicon],
        title: 'Revisão e retoques',
      },
    ],
  },
  {
    id: 'cel',
    coverLesson: 'lines',
    title: 'Cel shading anime 2D',
    description: 'Construa luzes chapadas e defina os contornos.',
    level: 'Depois dos fundamentos',
    lessons: [
      {
        id: 'values',
        title: 'Luz e sombra chapadas',
        colors: ['#8c3816', '#d46b26', '#f3a45e'],
        tool: 'shading',
        video: {
          id: 'CgOZihDQZeU',
          creator: 'Pintando Miniaturas',
          title:
            'Guia básico de LUZ e SOMBRA para pintura de miniaturas - Iniciantes e principiantes',
          language: 'pt-BR',
          level: 'iniciante',
          verifiedOn,
        },
      },
      {
        id: 'shadow-map',
        title: 'Mapa de sombras em quadrinhos',
        video: {
          id: 'E9olBV0kP3g',
          creator: 'Green Stuff World',
          title: 'Cel-Shading Miniatures: Achieve a comic look!',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'lines',
        title: 'Contornos e line art',
        video: {
          id: 'D0RQLzNgKrc',
          creator: 'Pintando Miniaturas',
          title: 'Como pintar estilo Anime (Cell Shading)',
          language: 'pt-BR',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'color-blocking',
        title: 'Blocos de cor no estilo Borderlands',
        video: {
          id: 'G3rfgSaheGA',
          creator: 'Epic Duck Studios',
          title: 'Comic Style Miniature Painting - Borderlands Style Minis',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'edge-lights',
        title: 'Luzes de recorte',
        video: {
          id: 'Ixhes5ujQNI',
          creator: "Kiki's Miniatures Mania",
          title:
            'Dipingere miniature in stile CEL-SHADING - Cel-Shaded Miniatures',
          language: 'it',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'toon-study',
        title: 'Estudo rápido de valores',
        video: {
          id: 'RaZej_Ra5AY',
          creator: 'MiniQuest 64',
          title: 'CEL SHADING explained In 5 Minutes!',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'anime-project',
        title: 'Projeto: miniatura com acabamento 2D',
        video: {
          id: 'oavnRpQ1ods',
          creator: 'Musha Miniatures',
          title:
            'Creating the Perfect Cell Shaded Miniature: A Step by Step Guide - Painting Kroot Hounds',
          language: 'it',
          level: 'intermediário',
          verifiedOn,
        },
      },
    ],
  },
  {
    id: 'realismo',
    coverLesson: 'realism-project',
    title: 'Realismo',
    description: 'Pratique transições suaves para dar volume.',
    level: 'Intermediário',
    lessons: [
      {
        id: 'layers',
        title: 'Transições e volume',
        resources: [lexicon],
      },
      {
        id: 'wet-blending',
        title: 'Mistura úmida na peça',
        video: {
          id: 'uqFnsbE1Mr4',
          creator: 'Zumikito Miniatures',
          title: 'FASTEST Way to Blend! | Wet Blending explained in 5 minutes',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'glaze',
        title: 'Veladuras e transições suaves',
        video: {
          id: 'rEcDL8mLZzo',
          creator: 'Vince Venturella',
          title: 'Ultimate Guide to Glazing - HC 391',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'skin-study',
        title: 'Preparação de uma paleta de pele',
        video: {
          id: 'y5zHgw95KyE',
          creator: 'William Lins Colecionáveis',
          title:
            'Tutorial Completo | Pintura de Pele Realista em Impressão 3D | Pincel e Aerógrafo Passo a Passo',
          language: 'pt-BR',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'skin',
        title: 'Pele e expressão',
        video: {
          id: 'WNUpeuEM0h4',
          creator: 'Kit Chronicles',
          title: 'How to Paint Realistic Miniature Faces - Step by Step',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'leather',
        title: 'Textura de couro',
        video: {
          id: 'x7SNEi1cOYQ',
          creator: 'Kujo Painting',
          title: 'Paint Leather - Fast and Easy',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
      },
      {
        id: 'realism-project',
        title: 'Projeto: volume e acabamento',
        video: {
          id: 'A13JfFJxtIg',
          creator: 'Dana Howl',
          title: 'How to Glaze Miniatures: A Beginner’s Guide to Color Glazing',
          language: 'en',
          level: 'intermediário',
          verifiedOn,
        },
        resources: [lexicon],
      },
    ],
  },
];

export const academyLibrary: Resource[] = [
  condorBrushGuide,
  wimpelManual,
  ...new Map(
    courses
      .flatMap((course) =>
        course.lessons.flatMap((lesson) => lesson.resources ?? []),
      )
      .map((resource) => [resource.url, resource]),
  ).values(),
  iwataCleaning,
];
