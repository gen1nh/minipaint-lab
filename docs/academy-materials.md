# Lesson materials and colors

A galeria mantém 20 projetos por estilo. Em 2026-11-26, seis publicações em português substituíram referências de Realismo e Fantasia. Canal, título, capa e visualizações foram conferidos na fonte original. As curtidas desses seis vídeos ficam sem valor quando a contagem não está disponível.

- Realismo: [Kratos](https://www.youtube.com/watch?v=RQrk3Dm8mig), [pele em impressão 3D](https://www.youtube.com/watch?v=XLhfU_4YZh0) e [busto do Capitão América](https://www.youtube.com/watch?v=prRoh96QOck).
- Fantasia: [dragão](https://www.youtube.com/watch?v=-iQHpc1LRJ8), [aparição de D&D](https://www.youtube.com/watch?v=X127jiubi-E) e [cores de miniaturas de RPG](https://www.youtube.com/watch?v=ib-Wgu-vF9k).
Every curated video lesson must include a materials and colors section, even when source details are unavailable. Each entry must distinguish author-confirmed (with source URL and timestamp or description reference), visually estimated (with uncertainty), and MiniPaint recommendation (not attributed to creator). Never invent exact brand, SKU, ratios or equipment used. Include required versus optional materials, brush sizes, primer, paint types, color roles, thinner/medium and finishing where relevant. Offer affordable alternatives including Brazilian brands when appropriate, with verified catalog identifiers only. Digital swatches and suggested recipes are estimates, not measured matches. Link suggested colors and recipes to the universal catalog and mixer without requiring accounts or inventory. Include practical test swatch guidance. If source is unavailable, explicitly mark unknown. Preserve creator credits, original video link and authorized embed. Recommendations are original editorial content. Lesson schema should support per-item evidence status, source URL, timestamp, optional catalog ID, approximate hex, role, and notes. Do not require purchasing specific brands to complete lessons.


## Vídeos de introdução

Links e títulos confirmados pelo oEmbed do YouTube em 2026-11-26. Os três vídeos foram publicados em português pelo canal Pintando Miniaturas. Preparação e diluição fazem parte de Fundamentos, enquanto luz e sombra abrem Cel shading. Os endereços antigos da playlist continuam abrindo as aulas correspondentes.

- [Preparação e primer](https://www.youtube.com/watch?v=OvpjKfada40)
- [Diluição para pincel](https://www.youtube.com/watch?v=lwJtzvME6KA)
- [Luz e sombra](https://www.youtube.com/watch?v=CgOZihDQZeU)

Materiais, exercícios e sugestões de cor são recomendações editoriais do Pincel Guia. As amostras digitais são aproximadas.

## Cursos e fontes

Cada curso organiza os materiais em uma sequência de exercícios que termina com uma miniatura pintada. Os passos, exercícios e critérios de revisão são textos do Pincel Guia. O idioma do material externo aparece na aula.

- **Fundamentos** · além dos vídeos de preparação e diluição da playlist, inclui [a primeira miniatura de Squidmar Miniatures](https://www.youtube.com/watch?v=UQfAyfMc6xs), o [guia de Warhammer Alliance em PDF](https://warhammer-alliance.com/wp-content/uploads/sites/16/2024/09/ENG_Warhammer_Alliance_Leaders_Guide_2024.pdf) e [dicas de retoque da equipe de pintura de Warhammer](https://www.warhammer-community.com/en-gb/articles/nJFh2M9g/highlights-basing-and-eyes-the-warhammer-painting-team-answer-your-hobby-questions/).
- **Cel shading anime 2D** · [Pintando Miniaturas demonstra a pintura estilo anime](https://www.youtube.com/watch?v=D0RQLzNgKrc) e [Musha Miniatures aplica a técnica a outra peça](https://www.youtube.com/watch?v=oavnRpQ1ods).
- **Realismo** · [o glossário da Warhammer Community em PDF](https://assets.warhammer-community.com/eng_hobby-hangout-zc9pb6pzsz-4nwupcj1la.pdf) acompanha os exercícios de transição, [Vince Venturella demonstra veladuras](https://www.youtube.com/watch?v=rEcDL8mLZzo) e [Dana Howl mostra a técnica aplicada a uma miniatura](https://www.youtube.com/watch?v=A13JfFJxtIg).

Capas servidas pelo YouTube. Vídeos reproduzidos pelo player oficial sob demanda, com link direto para a publicação original. PDFs e sites são acessados na origem.

O catálogo em `src/domain/academy/courses.ts` é a fonte dos 20 vídeos e guarda o autor, idioma, nível e data de verificação de cada aula. A Biblioteca reúne PDFs na fonte original sem repetir endereços.

## Guias de bancada e projetos

As fontes de `src/domain/academy/workshop.ts` foram verificadas em 2026-11-26. Cada link aponta para a publicação original. As capas são servidas pelo YouTube. Guias e materiais são referências para iniciantes. Projetos por estilo mostram técnicas intermediárias em peças específicas. Os treinos reutilizam vídeos dos cursos e os materiais para iniciantes usam demonstrações dos canais originais.

- **Aerógrafo e diluição** · [Pintando Miniaturas](https://www.youtube.com/watch?v=JQiF1a0MG4U), [Artesanato Impresso 3D](https://www.youtube.com/watch?v=UhV1rybMP9Q) e [orientações da Tom Colors](https://www.tomcolors.com.br/informacoes-gerais/usando-nossas-tintas-acrilicas). As orientações do fabricante se aplicam às suas linhas.
- **Limpeza** · [OG Miniaturas](https://www.youtube.com/watch?v=UqJIlcmJCZ4), [Iwata](https://www.iwata-airbrush.com/airbrush-cleaning.html) e [Professor Lúdico](https://www.youtube.com/watch?v=7wbUf14PVjw).
- **Preparo** · [Loot Studios](https://www.youtube.com/watch?v=P2ka3qzT4M0) e [Formlabs](https://formlabs.com/support/Removing-Support-Marks/).
- **Projetos** · [Goku](https://www.youtube.com/watch?v=wEua0gUq44k), [Sasuke](https://www.youtube.com/watch?v=LjiJNlEhrFg), [Batman](https://www.youtube.com/watch?v=bUy1VNZlAwc) e [Ork de Warhammer](https://www.youtube.com/watch?v=QBuLzP64hLs).
- **Materiais** · [ZukaVerso](https://www.youtube.com/watch?v=l_2mVl3eYkk).


## Roadmap de materiais

O roadmap em `src/domain/academy/material-roadmap.ts` orienta preparo, primeira pintura, acabamento e aerógrafo opcional. Cada etapa lista habilidades, um critério de avanço e alternativas por material. As opções econômicas e de investimento indicam posicionamento relativo, com links oficiais consultados em 2026-11-26. Materiais comuns podem ser reaproveitados. Os vídeos reaproveitam as aulas e guias já publicados.

## Popularidade dos projetos

O catálogo em `src/domain/academy/projects.ts` reúne 20 fontes originais por estilo. Títulos e canais foram conferidos pelo oEmbed. Visualizações e curtidas públicas foram consultadas na página de cada vídeo em 2026-11-26. Curtidas indisponíveis ficam sem valor e aparecem depois das contagens conhecidas ao ordenar por curtidas. Os números são um retrato da seleção, não um ranking geral do YouTube. O áudio nem sempre pôde ser verificado. Os títulos editoriais em português identificam a peça, e o título de origem acompanha o link. Todas as capas e vídeos são servidos pelo YouTube.

## Dicas de bancada adicionadas

Em Dicas, os filtros por assunto mostram os vídeos e PDFs da categoria selecionada. A Biblioteca inclui o [manual de pincéis da Condor](https://www.condor.ind.br/files/large/00b48d10fd516a1) e o [manual da Wimpel para uso e limpeza do MP-1003](https://www.wimpel.com.br/pdf/mp1003.pdf), ambos em português.

Os nove vídeos abaixo tiveram autoria e capa verificadas em 2026-11-26. São guias de iniciação, abertos na publicação original.

- Primeira pintura em português, com [vídeo de introdução](https://www.youtube.com/watch?v=56ffaBPd5m4), [cinco passos fundamentais](https://www.youtube.com/watch?v=g9y_6VazAqg) e [paleta úmida caseira](https://www.youtube.com/watch?v=uTW49RW2WMM).
- Preparação em inglês, com [montagem e preparo](https://www.youtube.com/watch?v=KxF8t6k39cE).
- Acabamento em português, com [luz e sombra](https://www.youtube.com/watch?v=rVDOMVnJdd0), [pincel seco](https://www.youtube.com/watch?v=lhIJQlVcwsc) e [verniz](https://www.youtube.com/watch?v=Q4tpccNvLnE). Consulte a ficha do verniz e as condições de aplicação do fabricante.
- Retoques e bases em inglês, com [correção de erros](https://www.youtube.com/watch?v=DKIPS5N5f0E) e [três bases simples](https://www.youtube.com/watch?v=VA5dRjrmIGg).
