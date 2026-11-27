import { openLabTool, openMixerFromHome } from './navigation';
import { test, expect } from '@playwright/test';
test('adds a paint from the catalog and changes its quantity', async ({
  page,
}) => {
  await page.goto('/');
  await openMixerFromHome(page);
  await expect(
    page.getByRole('heading', { name: 'Mistura de cores' }),
  ).toBeVisible();
  await expect(page.locator('output')).toContainText('Resultado: #');
  await page.getByRole('button', { name: 'Adicionar tinta' }).click();
  const third = page.getByRole('group', { name: 'Tinta 3', exact: true });
  await third
    .getByRole('textbox', { name: 'Buscar tinta comercial' })
    .fill('Acrilex 505');
  await third.getByRole('button', { name: /Amarelo Ouro/ }).click();
  await third
    .getByRole('button', { name: 'Aumentar gotas da tinta 3' })
    .click();
  await expect(
    third.getByRole('textbox', { name: 'Quantidade de gotas da tinta 3' }),
  ).toHaveValue('2');
});

test('selects a commercial paint', async ({ page }) => {
  await page.goto('/');
  await openMixerFromHome(page);
  const first = page.getByRole('group', { name: /Tinta 1/ });
  await first.getByRole('button', { name: /Trocar tinta/ }).click();
  await first
    .getByRole('textbox', { name: 'Buscar tinta comercial' })
    .fill('Acrilex 505');
  await first.getByRole('button', { name: /Amarelo Ouro/ }).click();
  const selected = first.getByRole('button', {
    name: /Amarelo Ouro.*Acrilex.*Trocar tinta/,
  });
  await expect(selected).toBeFocused();
  await expect(
    first.getByRole('textbox', { name: 'Buscar tinta comercial' }),
  ).toBeHidden();
  await selected.press('Enter');
  await page.keyboard.press('Escape');
  await expect(selected).toBeFocused();
});

test('preserves the current recipe across navigation', async ({ page }) => {
  await page.goto('/');
  await openMixerFromHome(page);
  await page.getByRole('button', { name: 'Aumentar gotas da tinta 1' }).click();
  const output = await page.locator('output').innerText();
  await openLabTool(page, 'Encontrar cores');
  await openLabTool(page, 'Misturar tintas');
  await expect(
    page.getByRole('textbox', { name: 'Quantidade de gotas da tinta 1' }),
  ).toHaveValue('3');
  await expect(page.locator('output')).toHaveText(output);
});
test('mobile mixer remains within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await openMixerFromHome(page);
  await expect(
    page.getByRole('heading', { name: 'Mistura de cores' }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(391);
});
test('saved recipe survives reload and deletion requires confirmation', async ({
  page,
}) => {
  await page.goto('/');
  await openMixerFromHome(page);
  await page.getByText('Salvar mistura', { exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Nome da receita' })
    .fill('Receita de teste');
  await page.getByRole('button', { name: 'Salvar receita' }).click();
  await expect(
    page.getByText('Receitas atualizadas.', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Mistura de cores' }),
  ).toBeVisible();
  await openLabTool(page, 'Meu ateliê');
  await page.getByRole('button', { name: 'Excluir', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Excluir receita?' })
    .getByRole('button', { name: 'Cancelar' })
    .click();
  await expect(page.getByText(/Receita de teste ·/)).toBeVisible();
});

test('Painting tips precede the lab and the lab groups tools and saved recipes', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Principal' });
  await expect(nav.getByRole('button')).toHaveText([
    'Início',
    'Dicas de pintura',
    'Laboratório de cores',
  ]);
  await nav.getByRole('button', { name: 'Laboratório de cores' }).click();
  await expect(
    page.getByRole('heading', { name: 'Laboratório de cores' }),
  ).toBeFocused();
  const main = page.getByRole('main');
  for (const tool of [
    'Misturar tintas',
    'Encontrar cores',
    'Cel shading',
    'Meu ateliê',
  ]) {
    await expect(
      main.getByRole('button', { name: new RegExp('^' + tool) }),
    ).toBeVisible();
  }
  await main.getByRole('button', { name: /^Meu ateliê/ }).click();
  await expect(
    page.getByText('Nenhuma receita salva.', { exact: true }),
  ).toBeVisible();
  await main.getByRole('button', { name: 'Laboratório de cores' }).click();
  await expect(
    page.getByRole('heading', { name: 'Laboratório de cores' }),
  ).toBeFocused();
});

test('the selected theme survives a reload', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Alternar tema' });
  const studio = page.locator('.studio');
  await expect(studio).toHaveAttribute('data-theme', 'dark');
  await toggle.click();
  await page.reload();
  await expect(studio).toHaveAttribute('data-theme', 'light');
  await toggle.click();
  await page.reload();
  await expect(studio).toHaveAttribute('data-theme', 'dark');
});
test('a cel shading swatch opens the search with its color', async ({
  page,
}) => {
  await page.goto('/');
  await openLabTool(page, 'Cel shading');
  await page.getByRole('button', { name: /Escolher tinta/ }).click();
  const search = page.getByRole('textbox', { name: 'Buscar tinta comercial' });
  await expect(search).toBeFocused();
  await search.fill('Acrilex 505');
  await page.getByRole('button', { name: /Amarelo Ouro/ }).click();
  await expect(
    page.getByRole('button', { name: /Amarelo Ouro.*Acrilex.*Trocar tinta/ }),
  ).toBeFocused();
  const light = page.getByRole('button', { name: /^Luz, #/ });
  const initial = await light.getAttribute('aria-label');
  await page.getByText('Luz e sombra', { exact: true }).click();
  const contrast = page.getByRole('slider', { name: /Contraste/ });
  await contrast.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(light).not.toHaveAttribute('aria-label', initial!);
  const hex = (await light.getAttribute('aria-label'))!.match(
    /#[a-f0-9]{6}/,
  )![0];
  await light.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Encontrar cores' }),
  ).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Cor desejada', exact: true }),
  ).toHaveValue(hex);
  await page.goBack();
  await expect(light).toHaveAttribute('aria-label', new RegExp(hex));
  await expect(
    page.getByRole('button', { name: /Amarelo Ouro.*Trocar tinta/ }),
  ).toBeVisible();
});

test('image search reports a bad upload and can recover', async ({ page }) => {
  await page.goto('/');
  await openLabTool(page, 'Encontrar cores');
  await page.getByRole('button', { name: 'Extrair de imagem' }).click();
  const upload = page.getByLabel('Imagem de referência');
  await upload.setInputFiles({
    name: 'broken.png',
    mimeType: 'image/png',
    buffer: Buffer.from('broken'),
  });
  await expect(page.getByRole('alert')).toContainText(
    'Não foi possível abrir a imagem',
  );
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 8;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#e97b65';
    context.fillRect(0, 0, 8, 8);
    return canvas.toDataURL('image/png').split(',')[1]!;
  });
  await upload.setInputFiles({
    name: 'sample.png',
    mimeType: 'image/png',
    buffer: Buffer.from(png, 'base64'),
  });
  await expect(
    page.getByRole('button', { name: 'Buscar esta cor' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Buscar esta cor' }).click();
  await expect(
    page.getByRole('button', { name: 'Buscar tinta', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('textbox', { name: 'Cor desejada', exact: true }),
  ).toHaveValue('#e97b65');
});

test('deleting in the atelier preserves a recipe saved in another tab', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'minipaint:recipes:v1',
      JSON.stringify([
        {
          id: 'existing',
          name: 'Receita anterior',
          hex: '#123456',
          thinner: 0,
          paints: [{ name: 'Tinta', brand: 'Teste', hex: '#123456', drops: 1 }],
        },
      ]),
    ),
  );
  await openLabTool(page, 'Meu ateliê');
  const other = await context.newPage();
  await other.goto('/');
  await openMixerFromHome(other);
  await other.getByText('Salvar mistura', { exact: true }).click();
  await other
    .getByRole('textbox', { name: 'Nome da receita' })
    .fill('Receita da outra aba');
  await other.getByRole('button', { name: 'Salvar receita' }).click();
  await expect(
    other.getByRole('status').filter({ hasText: 'Receitas atualizadas.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Receita da outra aba/ }),
  ).toBeVisible();
  const previous = page
    .getByRole('listitem')
    .filter({ hasText: 'Receita anterior' });
  await previous.getByRole('button', { name: 'Excluir' }).click();
  await page
    .getByRole('dialog', { name: 'Excluir receita?' })
    .getByRole('button', { name: 'Excluir receita', exact: true })
    .click();
  await expect(previous).toHaveCount(0);
  await page.reload();
  await openLabTool(page, 'Meu ateliê');
  await expect(
    page.getByRole('button', { name: /Receita da outra aba/ }),
  ).toBeVisible();
});

test('mobile keyboard navigation focuses the destination heading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page
    .getByRole('navigation')
    .getByRole('button', { name: 'Laboratório de cores' })
    .press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Laboratório de cores' }),
  ).toBeFocused();
  await page
    .getByRole('main')
    .getByRole('button', { name: /^Cel shading/ })
    .press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Paleta cel shading' }),
  ).toBeFocused();
});

test('the keyboard can sample a precise pixel from an image', async ({
  page,
}) => {
  await page.goto('/');
  await openLabTool(page, 'Encontrar cores');
  await page.getByRole('button', { name: 'Extrair de imagem' }).click();
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 4;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#123456';
    ctx.fillRect(0, 0, 4, 4);
    ctx.fillStyle = '#ffeedd';
    ctx.fillRect(1, 1, 1, 1);
    return canvas.toDataURL().split(',')[1]!;
  });
  await page.getByLabel('Imagem de referência').setInputFiles({
    name: 'pixel.png',
    mimeType: 'image/png',
    buffer: Buffer.from(png, 'base64'),
  });
  await page
    .getByRole('slider', { name: 'Coluna da amostra' })
    .press('ArrowLeft');
  await page
    .getByRole('slider', { name: 'Linha da amostra' })
    .press('ArrowLeft');
  await expect(
    page.getByRole('textbox', { name: 'Cor selecionada', exact: true }),
  ).toHaveValue('#ffeedd');
  await expect(page.locator('.image-sample-marker')).toBeVisible();
});

test('the scale opens a reference mixture and returns to the unchanged draft', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await openMixerFromHome(page);
  const drops = page.getByRole('textbox', {
    name: 'Quantidade de gotas da tinta 1',
  });
  await drops.fill('12');
  await drops.press('Enter');
  await expect(page.locator('output')).toContainText('#36282a');
  const sample = page.getByRole('button', { name: /Ver mistura #602f32/ });
  await sample.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Mistura #602f32' }),
  ).toBeFocused();
  await expect(page.getByText('4 gotas · 50%', { exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: 'Voltar à mistura' }).click();
  await expect(sample).toBeFocused();
  await expect(drops).toHaveValue('12');
  await expect(page.locator('output')).toContainText('#36282a');
});

test('catalog suggestions can be selected with the arrow keys', async ({
  page,
}) => {
  await page.goto('/');
  await openMixerFromHome(page);
  const ingredient = page.getByRole('group', { name: 'Tinta 1', exact: true });
  await ingredient.getByRole('button', { name: /Trocar tinta/ }).click();
  const suggestion = ingredient
    .getByRole('list', { name: 'Sugestões de tinta' })
    .getByRole('button')
    .first();
  await expect(suggestion).toBeVisible();
  const search = ingredient.getByRole('textbox', {
    name: 'Buscar tinta comercial',
  });
  await search.press('ArrowDown');
  await expect(suggestion).toBeFocused();
  await suggestion.press('Enter');
  await expect(
    ingredient.getByRole('button', { name: /Acqua Marina.*Trocar tinta/ }),
  ).toBeFocused();
});

test('primer comparison updates its preview without changing the recipe', async ({
  page,
}) => {
  await page.goto('/');
  await openMixerFromHome(page);
  const result = await page.locator('.mix-preview output').innerText();
  await page.getByRole('tab', { name: 'Sobre primer' }).click();
  const options = page.getByRole('group', { name: 'Cor do primer' });
  const after = page.locator('.primer-result');
  const onWhite = await after.textContent();
  await options.getByRole('button', { name: 'Preto' }).click();
  await expect(options.getByRole('button', { name: 'Preto' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(after).not.toHaveText(onWhite!);
  const onBlack = await after.textContent();
  await page
    .getByRole('slider', { name: /Camadas de tinta/ })
    .press('ArrowRight');
  await expect(after).not.toHaveText(onBlack!);
  const adjusted = await after.textContent();
  await page.getByRole('tab', { name: 'Sobre primer' }).press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Mistura' })).toBeFocused();
  await expect(page.locator('.mix-preview output')).toHaveText(result);
  await page.getByRole('tab', { name: 'Mistura' }).press('ArrowRight');
  await expect(after).toHaveText(adjusted!);
});

test('the three painted regions remain visible together when switching the editor', async ({
  page,
}) => {
  await page.goto('/');
  await openLabTool(page, 'Cel shading');
  const figure = page.locator('.cel-artwork');
  const image = figure.getByRole('img');
  const regions = page.getByRole('group', { name: 'Região para editar' });
  const control = (name: string) =>
    regions.getByRole('button', { name: new RegExp('^' + name) });

  for (const [region, code, name] of [
    ['Cabelo', '559', 'Azul'],
    ['Corpo', '505', 'Amarelo Ouro'],
    ['Roupa', '918', 'Roxo'],
  ]) {
    await control(region).click();
    await page.getByRole('button', { name: /Escolher tinta/ }).click();
    await page
      .getByRole('textbox', { name: 'Buscar tinta comercial' })
      .fill('Acrilex ' + code);
    await page
      .getByRole('list', { name: 'Tintas encontradas' })
      .getByRole('button', { name: new RegExp(name) })
      .click();
  }

  const readSvg = async () =>
    decodeURIComponent((await image.getAttribute('src'))!.split(',')[1]!);
  for (const [id, name] of [
    ['kid', 'Kid Goku'],
    ['goku', 'Goku'],
  ]) {
    await figure.getByLabel('Ilustração').selectOption(id);
    await expect(image).toHaveAttribute('alt', new RegExp('^' + name + ' com'));
    const combined = await readSvg();
    for (const hex of ['#2c76b7', '#feba11', '#7468a8'])
      expect(combined).toContain('fill="' + hex + '"');
    await control('Cabelo').click();
    await expect(
      page.getByRole('button', { name: /Azul.*Trocar tinta/ }),
    ).toBeVisible();
    expect(await readSvg()).toBe(combined);
    await figure.getByRole('button', { name: 'Ver cores originais' }).click();
    expect(await readSvg()).not.toBe(combined);
    await figure.getByRole('button', { name: 'Aplicar paleta' }).click();
    expect(await readSvg()).toBe(combined);
  }
});

test('the paint picker retries an unavailable catalog in place', async ({
  page,
}) => {
  await page.route('**/catalog.json', (route) => route.abort(), { times: 1 });
  await page.goto('/');
  await openMixerFromHome(page);
  const picker = page.locator('.catalog-picker').first();
  await picker.getByRole('button', { name: /Trocar tinta/ }).click();
  await expect(picker.getByRole('status')).toHaveText('Catálogo indisponível');
  await picker.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(
    picker.getByRole('list', { name: 'Sugestões de tinta' }),
  ).toBeVisible();
  await expect(page.locator('.mix-nearest-paint')).toBeVisible();
});

test('offers documented dilution only for a matching airbrush paint', async ({
  page,
}) => {
  await page.goto('/#misturar-tintas');
  const application = page.getByLabel('Como você vai aplicar?');
  await application.selectOption('airbrush');
  const useTip = page.getByRole('button', {
    name: 'Usar como ponto de partida',
  });
  await expect(useTip).toHaveCount(0);
  await page.getByRole('button', { name: 'Remover tinta 2' }).click();
  await page.getByRole('button', { name: /Trocar tinta/ }).click();
  await page
    .getByRole('textbox', { name: 'Buscar tinta comercial' })
    .fill('Vallejo 71.281');
  await page.getByRole('button', { name: /3B Russian Green/ }).click();
  await expect(useTip).toBeDisabled();
  await page.getByRole('button', { name: 'Aumentar gotas da tinta 1' }).click();
  await useTip.click();
  await expect(page.getByLabel('Diluente', { exact: true })).toHaveValue(
    'airbrush-thinner',
  );
  await expect(
    page.getByRole('textbox', { name: 'Quantidade de gotas de diluente' }),
  ).toHaveValue('1');
  await page.getByText('Salvar mistura', { exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Nome da receita' })
    .fill('Receita para aerógrafo');
  await page.getByRole('button', { name: 'Salvar receita' }).click();
  await expect(page.getByText('Receitas atualizadas.')).toBeVisible();
  await openLabTool(page, 'Meu ateliê');
  await page.getByRole('button', { name: /Receita para aerógrafo/ }).click();
  await expect(application).toHaveValue('airbrush');
  await expect(page.getByLabel('Diluente', { exact: true })).toHaveValue(
    'airbrush-thinner',
  );
});

test('cancelling a new paint keeps the formula and restores focus', async ({
  page,
}) => {
  await page.goto('/#misturar-tintas');
  const preview = page.locator('.mix-preview output');
  await expect(preview).toBeVisible();
  const original = await preview.textContent();
  const add = page.getByRole('button', { name: 'Adicionar tinta' });
  await add.click();
  await expect(
    page.getByRole('textbox', { name: 'Buscar tinta comercial' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(add).toBeFocused();
  await expect(preview).toHaveText(original!);
  await expect(page.locator('.ingredient')).toHaveCount(2);
  await page.getByRole('button', { name: 'Remover tinta 2' }).press('Enter');
  await expect(
    page.getByRole('button', { name: /Preto.*Trocar tinta/ }),
  ).toBeFocused();
});

test('browser back closes the recipe dialog and focuses the destination', async ({
  page,
}) => {
  await page.goto('/');
  await openMixerFromHome(page);
  await page.getByRole('button', { name: 'Salvar mistura' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Salvar esta mistura' }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Laboratório de cores' }),
  ).toBeFocused();
});

test('the primer tip opens the comparison and keeps the current formula', async ({
  page,
}) => {
  await page.goto('/#misturar-tintas');
  await page.getByRole('button', { name: 'Aumentar gotas da tinta 1' }).click();
  await page
    .getByRole('navigation')
    .getByRole('button', { name: 'Dicas de pintura' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Por onde começar' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Comparar sobre primer' }).click();
  await expect(page.getByRole('tab', { name: 'Sobre primer' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(
    page.getByRole('textbox', { name: 'Quantidade de gotas da tinta 1' }),
  ).toHaveValue('3');
});

test('a saved recipe restores primer and user-reported application test', async ({
  page,
}) => {
  await page.goto('/#misturar-tintas');
  await page.getByRole('tab', { name: 'Sobre primer' }).click();
  const primer = page
    .getByRole('group', { name: 'Cor do primer' })
    .getByRole('button', { name: 'Preto' });
  await primer.click();
  await page
    .getByRole('slider', { name: /Camadas de tinta/ })
    .press('ArrowRight');
  await page.getByLabel('Testei esta aplicação na peça').check();
  await page.getByRole('button', { name: 'Salvar mistura' }).click();
  await page
    .getByRole('textbox', { name: 'Nome da receita' })
    .fill('Primer da armadura');
  await page.getByRole('button', { name: 'Salvar receita' }).click();
  await expect(page.getByText('Receitas atualizadas.')).toBeVisible();
  await openLabTool(page, 'Meu ateliê');
  await expect(
    page.getByText('Primer preto · 2 camadas · Teste registrado'),
  ).toBeVisible();
  await page.getByRole('button', { name: /Primer da armadura/ }).click();
  await page.getByRole('tab', { name: 'Sobre primer' }).click();
  await expect(primer).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Testei esta aplicação na peça')).toBeChecked();
  await page.getByRole('button', { name: 'Aumentar gotas da tinta 1' }).click();
  await expect(
    page.getByLabel('Testei esta aplicação na peça'),
  ).not.toBeChecked();
});
