export type ProjectVideo = {
  id: string;
  title: string;
  creator: string;
  originalTitle: string;
  views: number;
  likes?: number;
  language?: 'Português' | 'Espanhol';
};

export const projectGroups: {
  id: string;
  title: string;
  videos: ProjectVideo[];
}[] = [
  {
    id: 'anime',
    title: 'Anime',
    videos: [
      {
        id: 'aK_yYlNMOSw',
        title: 'Zoro de One Piece',
        creator: 'Camologyx',
        originalTitle:
          'How I Painted the ULTIMATE One Piece ZORO Figure | 3D Print & Paint',
        views: 104893,
        likes: 3119,
      },
      {
        id: 'ikTFd77bxfA',
        title: 'Asuka de Evangelion',
        creator: 'かりんとう Karinto painting',
        originalTitle:
          'Resin Figure model kit/【EVANGELION ASUKA】エヴァンゲリオン惣流アスカラングレーフィギュア塗装・製作風景（garage kit painting ）ガレージキット',
        views: 90428,
      },
      {
        id: 'Tz4X-r1wwFg',
        title: 'Hatsune Miku em garage kit',
        creator: 'H Hobby',
        originalTitle:
          '初音ミク Hatsune Miku speed build garagekit figure painting',
        views: 70409,
        likes: 5585,
      },
      {
        id: '1PxdO1C1sS4',
        title: 'Luffy Gear 5',
        creator: 'TinyLittles3D',
        originalTitle: '3D Printed my own LUFFY statue in GEAR 5 | One Piece',
        views: 65004,
        likes: 1536,
      },
      {
        id: 'ayxS80rHE7s',
        title: 'Gundam RX-78-2 em estilo anime',
        creator: 'Not So Average Builder',
        originalTitle: 'Anime style edge shading tutorial: RX78-2 Gundam head',
        views: 60711,
        likes: 1482,
      },
      {
        id: 'bO5_UDYI6D8',
        title: 'Goku Super Saiyajin',
        creator: 'Camologyx',
        originalTitle:
          'How I Painted the ULTIMATE Super Saiyan GOKU Figure | 3D Print & Paint Showcase',
        views: 43128,
        likes: 1442,
      },
      {
        id: 'CgvUJYAlHdc',
        title: 'Eva Unidade 01 a pincel',
        creator: 'Chop!!! Factory',
        originalTitle:
          '【ヤシマ作戦】筆塗りでエヴァンゲリオン初号機を仕上げる【Brashi Paint】Finishing the Evangelion Unit-01 with a brush',
        views: 25552,
        likes: 695,
      },
      {
        id: 'M4UI3hYkI0M',
        title: 'Zaku do Char com acabamento fosco',
        creator: 'ガンプラスタジオDON / Gunpla Studio DON',
        originalTitle:
          '【ガンプラ成形色仕上】HGシャア専用ザク成形色つや消しウェザリング仕上げ',
        views: 21514,
        likes: 457,
      },
      {
        id: 'k9Q8T34gOGM',
        title: 'Nezuko de Demon Slayer',
        creator: 'CW Studio',
        originalTitle: 'I Made Nezuko Demon Slayer - Figure Drawing 3D Printed',
        views: 20750,
        likes: 816,
      },
      {
        id: 'sfE50wmyGGM',
        title: 'Rei Ayanami de Evangelion',
        creator: '-making a resin kit-',
        originalTitle:
          'エヴァンゲリオン:綾波レイ　ガレージキット　フィギュア製作【Garage Kit Painting - Neon Genesis Evangelion REI  Part1 】4K画質',
        views: 14306,
        likes: 218,
      },
      {
        id: '2-ZSoNFqVlg',
        title: 'Charizard',
        creator: 'Chris Chaotic',
        originalTitle:
          '3D Printing My Own Charizard Figure - Sculpt.  Print.  Paint.',
        views: 13742,
        likes: 395,
      },
      {
        id: 'dE33jyYGEEo',
        language: 'Português',
        title: 'Vegeta de Dragon Ball Z',
        creator: 'Pintando Miniaturas',
        originalTitle:
          '🔴 VEGETA - Pintura e acabamento Impressão 3d - Dragon Ball Z',
        views: 11523,
        likes: 512,
      },
      {
        id: 'mS3pz1LKpyo',
        title: 'Racing Miku',
        creator: 'H Hobby',
        originalTitle:
          'WF2025W ワンフェス garagekit figure painting Hatsune Miku Speed Build 初音ミク GSR レーシングミク',
        views: 8089,
        likes: 530,
      },
      {
        id: 'wEua0gUq44k',
        language: 'Português',
        title: 'Goku em cel shading',
        creator: 'Pintando Miniaturas',
        originalTitle:
          'GOKU - Pintura AO VIVO com Técnica de Cell Shading: Dê Vida ao Seu Herói de Dragon Ball Z!',
        views: 6386,
        likes: 362,
      },
      {
        id: 'BG7vyv0xUno',
        title: 'Gundam Assemble em cel shading',
        creator: 'Erik Swinson',
        originalTitle:
          'How to Paint Gundam Assemble Cell Shaded Anime/Manga Style Miniatures',
        views: 5847,
        likes: 205,
      },
      {
        id: 'WivNLxt7Jsk',
        title: 'Guts de Berserk',
        creator: 'Camologyx',
        originalTitle:
          'How I Painted the ULTIMATE Berserk GUTS Figure | 3D Print & Paint',
        views: 5198,
        likes: 265,
      },
      {
        id: 'LjiJNlEhrFg',
        title: 'Sasuke, de Naruto',
        creator: 'FiguresForge3D',
        originalTitle: '3D Printing Anime Figures | SASUKE from NARUTO',
        views: 5150,
        likes: 116,
      },
      {
        id: 'oR7Rf7FKndk',
        title: 'Luffy em resina',
        creator: 'EJ Tech and DIY',
        originalTitle:
          'How I Brought Luffy to Life: 3D Printing & Painting My Own One Piece Statue!',
        views: 5126,
        likes: 126,
      },
      {
        id: 'krhB6pRwYiQ',
        title: 'Itachi Uchiha',
        creator: 'H3D_Clips - 3D Printing',
        originalTitle: 'Itachi 3D Print&Paint - Uchiha Itachi Figure',
        views: 1700,
        likes: 23,
      },
      {
        id: 'Iqpg0IwYCyE',
        title: 'Tanjiro chibi',
        creator: 'my3dprintsss',
        originalTitle:
          'Tanjiro (Chibi) - Demon Slayer | 3D Print & Paint Process | Impresión y Pintura en 3D',
        views: 209,
        likes: 3,
      },
    ],
  },
  {
    id: 'real',
    title: 'Realismo',
    videos: [
      {
        id: 'jIvVbpwcWOs',
        title: 'Capitão América em grande escala',
        creator: 'PropsNstuff',
        originalTitle:
          'A HUGE 3D printed Captain America - How to Paint N’stuff',
        views: 450182,
        likes: 6779,
      },
      {
        id: 'g8dXskKfEC0',
        title: 'Figuras personalizadas de Star Wars',
        creator: 'Boylei Hobby Time',
        originalTitle: 'How to Make Custom Star Wars Action Figures',
        views: 249196,
        likes: 16297,
      },
      {
        id: '1iMb1gCxc00',
        title: 'Soldado em escala 1:35',
        creator: 'MrTig2010 Military Models',
        originalTitle:
          'EASY 1/35 Figure Face Painting & Figure Painting Tutorial for Beginners I Realistic Miniatures',
        views: 171111,
        likes: 3532,
      },
      {
        id: 'C6jiNP79GNs',
        title: 'Legionário romano',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle: 'How to Paint: Imperial Roman Legionary.',
        views: 129991,
        likes: 4782,
      },
      {
        id: '-cE4lSskR4g',
        title: 'Figura pintada em 180 horas',
        creator: 'Sergio Calvo Miniatures',
        originalTitle:
          'Pasé 180 HORAS pintando esta figura, este es el resultado | Arte RELAJANTE',
        views: 120143,
        likes: 1987,
      },
      {
        id: 'AxeqHKB_vQk',
        title: 'Wolverine com tinta acrílica',
        creator: 'All Things Art',
        originalTitle:
          'Complete Guide to Painting a 3D Printed Wolverine Statue with Acrylics | Zez Studios Tutorial',
        views: 59012,
        likes: 290,
      },
      {
        id: 'RQrk3Dm8mig',
        title: 'Pele pálida do Kratos',
        creator: 'Pintando Miniaturas',
        originalTitle:
          'KRATOS - Pintura Realista AO VIVO: Como pintar pele PÁLIDA',
        views: 9069,
        language: 'Português',
      },
      {
        id: 'VjUy1T7t6Hg',
        language: 'Espanhol',
        title: 'Batman com aerógrafo',
        creator: 'Print&Paint Studio',
        originalTitle:
          'Como pintar Batman realista impreso en 3D//Tutorial aerógrafo en español//impresión 3D',
        views: 46391,
        likes: 1878,
      },
      {
        id: '1tE_TTUAh_I',
        title: 'Pintura de soldados',
        creator: 'ROGO minis',
        originalTitle: '🪖 !Pinta Soldados como Profesional! 🪖',
        views: 35292,
        likes: 1339,
      },
      {
        id: 'qw2x-8qFhdE',
        title: 'Coringa impresso em 3D',
        creator: 'All Things Art',
        originalTitle: 'Step by Step Guide | Learn to Paint a 3D Printed Joker',
        views: 33005,
        likes: 593,
      },
      {
        id: 'g98JQIuq7pM',
        title: 'Busto pintado a óleo',
        creator: 'biberhunter_scale_models',
        originalTitle: 'Bust Painting in Oils: Full step by step Tutorial',
        views: 22621,
        likes: 690,
      },
      {
        id: 'iBv8gw77zww',
        title: 'Busto de legionário romano',
        creator: 'Flying Raven Studios',
        originalTitle: 'Painting this Awesome 1/10 Roman Legionary Bust',
        views: 21230,
        likes: 553,
      },
      {
        id: 'b_s3oIfc_jU',
        title: 'Homem-Aranha impresso em 3D',
        creator: 'Groundeffected',
        originalTitle:
          'Spiderman - How To Paint 3D Printed Spiderman | Groundeffected.com',
        views: 19868,
        likes: 1139,
      },
      {
        id: 'bUy1VNZlAwc',
        title: 'Busto realista do Batman',
        creator: 'MY MINICRAFT',
        originalTitle:
          'REALISTIC bust from batman Dark Knight build and painting',
        views: 11419,
        likes: 369,
      },
      {
        id: 'prRoh96QOck',
        title: 'Busto do Capitão América para iniciantes',
        creator: 'Geekeando Art 3D - Impressão 3D',
        originalTitle:
          'IMPRESSÃO 3D e PINTURA - BUSTO CAPITÃO AMÉRICA [TUTORIAL PARA INICIANTES]',
        views: 2106,
        language: 'Português',
      },
      {
        id: 'v5sFX7vAoNM',
        title: 'Luz solar e sombra em uma figura',
        creator: 'AK Interactive Official',
        originalTitle:
          'TUTORIAL | MASTER SUNLIGHT ON FIGURES ☀️ | SUN & SHADE TONE by Kirill Kanaev made @lou_miniatures',
        views: 7054,
        likes: 310,
      },
      {
        id: 'fLIEZbfhXi4',
        title: 'Rostos de figuras com Lifecolor',
        creator: 'Scale War Machines',
        originalTitle: "PAINTING FIGURES' FACES STEP BY STEP WITH LIFECOLOR",
        views: 6364,
        likes: 217,
      },
      {
        id: 'XLhfU_4YZh0',
        title: 'Pele realista em impressão 3D',
        creator: 'Pintando Miniaturas',
        originalTitle: '🔴 Pintando profissionalmente pele em impressão 3d',
        views: 2687,
        language: 'Português',
      },
      {
        id: 'ZQlc3A-ixcQ',
        title: 'Arthur Morgan de Red Dead Redemption 2',
        creator: 'FIGO.STUDIO',
        originalTitle:
          'Paint 3D‑Printed Arthur Morgan (RDR2) – Full Step‑by‑Step Painting Tutorial',
        views: 4082,
        likes: 166,
      },
      {
        id: 'oRvikeWukl8',
        title: 'Pintura de rosto realista',
        creator: 'Flying Raven Studios',
        originalTitle:
          'I found 4 secrets to painting realisitic faces! A beginners guide',
        views: 3738,
        likes: 132,
      },
    ],
  },
  {
    id: 'fantasy',
    title: 'Fantasia e wargame',
    videos: [
      {
        id: 'rz76A0Jpp7E',
        title: 'Primeiro Space Marine',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle:
          'Learn to Paint your first Warhammer miniature | Space Marine | Duncan Rhodes',
        views: 623891,
        likes: 19831,
      },
      {
        id: 'X_Y61xmylas',
        title: 'Stormcast Liberators e Prosecutors',
        creator: 'Warhammer',
        originalTitle:
          'Warhammer Age of Sigmar: How to paint Stormcast Liberators & Prosecutors.',
        views: 611902,
        likes: 4011,
      },
      {
        id: 'uZ0im09iRww',
        title: 'Goff Ork Boyz',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle: 'Goff Waaghhhh! How to paint Goff Ork Boyz for 40K',
        views: 299567,
        likes: 7183,
      },
      {
        id: 'hAWqkYW61xM',
        title: 'Death Guard Plague Marines',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle:
          'How to paint your Death Guard Plague Marines for Warhammer 40,000 | Killteam | Duncan Rhodes',
        views: 254295,
        likes: 6609,
      },
      {
        id: 'yOGqdd0XOZM',
        title: 'Khorne Berzerkers',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle:
          'How to Paint Khorne Berzerkers for Warhammer 40,000 | Duncan Rhodes',
        views: 212272,
        likes: 5760,
      },
      {
        id: 'cVLcpgqUgWM',
        title: 'Tiranídeos em três estilos',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle:
          '3 Ways to Speed Paint your Tyranids | Warhammer 40,000 | Duncan Rhodes',
        views: 206221,
        likes: 6020,
      },
      {
        id: '7PHukfla7kE',
        title: 'Chaos Space Marines',
        creator: 'EonsOfBattle',
        originalTitle: 'The Better Way to Paint Chaos Space Marines!',
        views: 189490,
        likes: 6657,
      },
      {
        id: 'B3GEbSsFaKs',
        title: 'Dragão de Squidmar',
        creator: 'Squidmar Miniatures',
        originalTitle:
          'Professional Painting Secrets - Squidmar Dragon Masterclass',
        views: 157003,
        likes: 5111,
      },
      {
        id: 'M_ENz2ED6pM',
        title: 'Busto de orc de Sergio Calvo',
        creator: 'Sergio Calvo Miniatures',
        originalTitle:
          'This is what 16 YEARS of miniature painting looks like, the BEST orc bust I have ever painted',
        views: 145706,
        likes: 3600,
      },
      {
        id: 'xA10FiI6nNU',
        title: 'Miniatura Death Guard',
        creator: 'Brushstroke Painting Guides',
        originalTitle: 'How To Paint Death Guard: A Step-By-Step Guide',
        views: 119069,
        likes: 3577,
      },
      {
        id: 'VamQG_xcy6c',
        title: 'Dragão vermelho de D&D',
        creator: "Doctor Faust's Painting Clinic",
        originalTitle: 'Painting a Red Dragon Miniature for Dungeons & Dragons',
        views: 118361,
        likes: 3156,
      },
      {
        id: 'dFOE_3KiFPg',
        title: 'Skaven de Age of Sigmar',
        creator: 'Warhammer',
        originalTitle: 'Painting Skaven QUICK-QUICK! | Warhammer Age of Sigmar',
        views: 85177,
        likes: 2039,
      },
      {
        id: 'a1oRBdT0dvU',
        title: 'Orc Boyz de The Old World',
        creator: 'Duncan Rhodes Painting Academy',
        originalTitle:
          'Waaagh!!! How to paint your Warhammer Old World Orc Boyz | Duncan Rhodes',
        views: 53076,
        likes: 1934,
      },
      {
        id: 'rKumrvcfKLA',
        title: 'Infernus Space Marine',
        creator: 'Warhammer',
        originalTitle:
          'How to Paint: Infernus Space Marine | Beginner | Warhammer 40,000',
        views: 45315,
        likes: 1009,
      },
      {
        id: 'ib-Wgu-vF9k',
        title: 'Aplicação das cores em miniaturas de RPG',
        creator: 'Tenda Arcana',
        originalTitle: 'Como pintar miniaturas de RPG - Aplicação das cores',
        views: 5663,
        language: 'Português',
      },
      {
        id: 'FWPDoPT7pzY',
        title: 'Stormcast Eternal Liberator',
        creator: 'Warhammer',
        originalTitle:
          'How To Paint: Stormcast Eternal Liberator | Beginner | Warhammer Age of Sigmar',
        views: 35185,
        likes: 698,
      },
      {
        id: 'QBuLzP64hLs',
        title: 'Pele de Ork de Warhammer 40K',
        creator: 'Sergio Calvo Miniatures',
        originalTitle:
          'WARHAMMER 40K mis TRUCOS para pintar un ORKO con una piel ÚNICA',
        views: 28487,
        likes: 1260,
      },
      {
        id: 'knRUQF1dK30',
        title: 'Guerreiro esqueleto',
        creator: 'The Hobby Grotto',
        originalTitle: 'Painting a Skeleton Warrior!',
        views: 26357,
        likes: 859,
      },
      {
        id: 'X127jiubi-E',
        title: 'Aparição de D&D',
        creator: 'FALA CHOKITO',
        originalTitle:
          '‹ COMO PINTAR UMA APARIÇÃO | PASSO A PASSO DE PINTURA DE MINIATURAS D&D ›',
        views: 61,
        language: 'Português',
      },
      {
        id: '-iQHpc1LRJ8',
        title: 'Repintura de um dragão',
        creator: 'Noite de Jogo',
        originalTitle: 'RE PINTANDO UM DRAGÃO | PITS PAINTS',
        views: 182,
        language: 'Português',
      },
    ],
  },
];
