# Experimentos open source

## Color Thief 3.5.0

Comparação exploratória em dois arquivos, decodificados no mesmo canvas de 420 × 420. Para cada foto, ambos os métodos receberam a imagem inteira e um recorte central de 70% por eixo. Os resultados são escolhas de cores digitais.

| Foto | Extrator atual no recorte | Color Thief no mesmo recorte |
| --- | --- | --- |
| Figura de Probert | As quatro primeiras cores ficaram próximas entre si. A pele apareceu em quinto, em `#ed8f71`. | Tom quente `#e79f7e` em primeiro, seguido de azul escuro e azul claro entre os três primeiros. |
| Jersey Devil | Tons escuros e marrons, com `#6d554a` entre os marrons do recorte. | Tons ainda escuros no começo, com tons mais claros na segunda metade, como `#b7a89d`. |

Color Thief apresentou mais variedade. Duas fotos e recorte central não permitem concluir que as cores mais variadas são as mais úteis para pintura. O algoritmo atual continua em uso. Extensão do teste exigiria recortes escolhidos por pintores e avaliação de utilidade.

- [Figura de Probert](https://commons.wikimedia.org/wiki/File:D_Probert_miniature_figure_1.jpg), fotografia disponibilizada por Mochyn pridd, CC BY-SA 4.0.
- [Jersey Devil](https://commons.wikimedia.org/wiki/File:Jersey_devil_mini.jpg), fotografia de Dystopiamatt, CC BY-SA 4.0.

## Knip 6.48.0

Execução avulsa. Detectou a exportação interna de `Lesson`, removida, e sinalizou `lighthouserc.cjs`. Esse arquivo foi mantido porque o Lighthouse CI o carrega. O Knip não virou dependência.

## pdf-lib 1.17.1

Foi gerado um protótipo A4 de uma página com dados de exemplo, incluindo amostra estimada, ingredientes, gotas, primer e observação. O texto foi extraído e a página renderizada para inspeção visual. A exportação de receitas reais ainda não está integrada ao Ateliê. A decisão sobre uma biblioteca fixa fica para quando compararmos o protótipo com a impressão do navegador.
