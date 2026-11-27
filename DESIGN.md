# Digital Artist Studio
A practical, expressive workspace for miniature painters. Navigation links to Home, Color Lab, Atelier and Academy. Give each view a clear primary action. Lessons use original videos or PDFs, with credits and source links. Use semantic HTML, visible keyboard focus, reduced motion and WCAG 2.2 AA as acceptance targets. Both themes use neutral work surfaces to preserve color perception. Identify swatches with labels as well as color.
## Product scope update
Free public access without accounts or inventory. Select commercial paints directly from the universal catalog. The mixer labels unbranded samples as example colors and opens with two samples or uses the ingredients from an existing recipe. The add-paint action sits beside the ingredient heading and opens the catalog picker. Selecting a paint adds it to the recipe, and dismissing the picker keeps the recipe intact. The remove action sits inside each paint card as a separate control. The ingredient drop stepper shares the paint card and spans its width. The preview shows separate totals for paint and diluent drops and shows the nearest digital swatch automatically below the result. Courses are original curated learning paths with authorized embedded videos, creator attribution, source links, original exercises and optional browser-local progress. No video rehosting, mandatory registration or paywall. This supersedes earlier inventory plans.

## Compact-first UX (required)
Prioritize useful screen density, clear hierarchy and immediate task completion. Avoid oversized heroes, redundant cards, excessive whitespace, decorative badges, repeated headings and long default pages. Desktop lessons: video and compact playlist side by side; materials, colors, exercises and credits in concise tabs or expandable sections. Mobile: responsive single column, compact lesson selector and progressive disclosure. Mixer: compact ingredient rows, searchable catalog picker, visible result and quantities; advanced controls collapsed by default. Prefer lists and tables over card grids for dense data. Preserve readable typography, keyboard access, visible focus, contrast and adequate touch targets. Never sacrifice accessibility for density. Validate desktop and mobile layouts before release.

## Playful Creative Studio

The home page opens with five interactive paint swatches, followed by a two-column tool grid and an Academy entry point. Each named swatch opens Find colors with that sample selected. The main action opens Color Lab. The sidebar orders Home, Academy and Color Lab. The Lab landing page reuses the Home shortcut component for Mix paints, Find colors, Cel shading and Atelier. Each tool has a return button to the Lab.

Pincel Guia é o nome público do ateliê. O símbolo mostra um pincel de precisão traçando uma pincelada. Ele funciona no cabeçalho e no favicon. A tipografia usa Instrument Sans variável, de 400 a 700, para texto, títulos e controles.

| Área | Cor | Função |
| --- | --- | --- |
| Marca e ações | Ameixa | Identidade, ação principal e foco |
| Misturar tintas | Terracota | Pigmento e preparo de receitas |
| Encontrar cores | Azul mineral | Exploração e busca |
| Cel shading | Âmbar | Luz, sombra e planos |
| Dicas de pintura | Jade | Aprendizado e prática |
| Meu ateliê | Lavanda | Arquivo de receitas |

A comunicação começa pela ação e usa o vocabulário de quem pinta, como trocar tinta, ajustar gotas e salvar mistura. A frase de abertura é “Da primeira gota à sua cor.”

O tema claro usa superfícies de papel e o escuro usa carvão com subtom ameixa. As superfícies de trabalho são discretas para favorecer a leitura das tintas. Cada tom funcional tem um par próprio de fundo e texto em ambos os temas. A cor complementa os rótulos e os ícones. Amostras de tintas comerciais e misturas preservam seus valores originais. A fonte é servida localmente sob a licença descrita em [avisos de terceiros](THIRD_PARTY_NOTICES.md).

Busuu informed the prominent primary action and the visual entry points into learning. [Busuu](https://www.busuu.com/pt)

The app shell fills the viewport. The workspace sits in a centered grid beside the desktop sidebar, with fluid gutters and an 82rem maximum including padding. On tablets and mobile, a fixed bottom bar exposes Home, Academy and Laboratory with labeled touch targets. Main content stacks in reading order on narrow screens.

The Home, Lab, tools, Atelier and Academy use the same workspace container, responsive gutters and spacing between major sections. The Lab and Academy use the same contextual Back control above the page heading.

Selects, sliders and file input buttons share app-wide visual styles and retain native keyboard and activation behavior. Supported browsers also apply the same surface and spacing tokens to the select popup. Tool entrances and pressed feedback respect reduced motion. The theme preference is saved locally and restored on reload.

Tool navigation moves focus to the destination heading. Image extraction offers column and row controls for pixel selection by keyboard, with a marker on the image.

- **Mix paints** places ingredients and dilution in the editor, next to the preview and save action. Saving, replacing and deleting recipes use the same dialog style. Global feedback appears in a dismissible notice. Saving focuses the recipe name field. Optional application controls are visible below the ingredients, show brush or airbrush guidance and keep dilution separate from the color preview. The same drop stepper supports increment, decrement and direct entry for paints and thinner. With two paints, the ratio control beside the result redistributes the current drops. A nine-swatch spectral scale shows the transition. Each sample opens an eight-drop reference formula with HEX and catalog identifiers for its ingredients, then returns focus to the same swatch and preserves the current recipe. The scale has its own panel below the ingredients. On desktop it fills the remaining column height alongside the preview and its swatches stretch with it. At narrower widths, the preview comes before the scale. Both preview tabs reserve the same space. Preview tabs switch between the mixture and its appearance over primer. Primer shows the selected base and simulated painted color side by side, with fixed illustrative coverage and an adjustable number of coats. Shared swatch edges preserve the shape of dark colors against dark backgrounds without altering the displayed color.
- **Find colors** has three modes for searching, extracting a palette from a reference image and correcting an existing mix. Changing modes keeps the current work. Search and correction use native color inputs over large swatches. Results put the color first and identify paints and mixtures by name.
- **Cel shading** uses the same catalog picker to choose a base paint, then generates two shadow and two light tones. Editing controls, the illustration preview and the generated tones use separate panels. The initial orange is labeled as an example. Contrast and light temperature update the active region of the illustration and its five swatches together. Each tone opens its closest catalog match automatically, with alternative paints and mixtures shown on demand.
- **Atelier** displays saved recipes as named swatches with application, dilution and optional primer context, with comparison and backup kept near their respective actions. **Academy** has a hub with an ordered course catalog, a PDF library, and videos for bench guides and independent study. Course video and PDF links share one surface.

Academy courses and lessons have shareable URLs. Browser history restores the active lesson after opening a tool. The course roadmap and lesson player use original video thumbnails, and opening a lesson loads the player only when requested. Lessons link to free reading at its source and offer a next-step action for ordered study.

The materials roadmap separates the stage selector, learning goals, readiness criteria and the shopping list. The learning block uses a tinted surface and the product options share consistent labels across stages.

The Academy hub uses six theme-aware card colors. Bench guides, projects by style, drills point directly to videos and PDFs. The materials roadmap compares economical and higher-investment equipment one stage at a time and links to related lessons. The project gallery renders one style at a time and sorts the curated selection by recorded views or likes.

Impeccable informed the hierarchy of the working surfaces. Frontend Design informed the color-first compositions and original facets. UI/UX Pro Max informed control sizing, labels, focus and responsive checks.

Cel Shading is the only tool with character art. Its credited Wikipe-tan SVG applies the five generated tones to designated hair shapes, with a highlight clipped to the hair silhouette. The original colors are available for comparison. Functional icons and color swatches keep their distinct roles.

The locally supplied Goku SVGs support three independent regions: hair, skin and clothing. The region selector precedes the paint picker and shows the chosen paint for each part. On mobile, both appear before the illustration. Light and shadow controls are available on demand. Each region keeps its own paint, contrast and temperature, and the single preview composites every configured region. Both Goku poses use the same selections during the session.

The Academy offers a first-miniature entry point with a minimal shopping checklist and searchable projects. The Atelier searches recipe and paint names, and recipes may record a short application note.

The materials roadmap shows connected stations, with pictograms and color examples for the starter kit. Internal course, roadmap and tool links remember the source screen for their Back action.

Project filters persist in the URL. Bench guides start with first painting and provide keyboard-accessible topic filters. Returning from a roadmap lesson restores focus to the lesson link in the selected stage.

The curated project search also offers a link to YouTube search using the current term and style. External results open separately and leave the current filters in place.

Curated project search tolerates typos with the basic Fuse.js build, while preserving style, language and popularity controls.
The Academy home searches all published Academy sections using the existing Fuse.js index library. Image extraction can use either the whole image or a keyboard-adjustable crop and keeps pixel sampling available.

Academy search results show video covers or content icons. The materials roadmap uses a stage rail on desktop and a compact picker on mobile. Learning, product comparison and starter kit are separate views, with the active stage and view retained in the URL. The Academy Back button returns one history entry from a lesson navigation.
