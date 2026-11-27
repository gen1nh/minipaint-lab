import { expect, test } from '@playwright/test';

test('Academy search finds lessons and PDFs and preserves the term on reload', async ({
  page,
}) => {
  await page.goto('/academia');
  const input = page.getByRole('searchbox', { name: 'Buscar na Academia' });
  await input.fill('primer');
  await expect(
    page.getByRole('link', { name: /Preparação e primer/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Preparação e primer/ }).locator('img'),
  ).toHaveAttribute('src', /i\.ytimg\.com/);
  await input.fill('Condor');
  await expect(
    page.getByRole('link', { name: /Manual de pincéis/ }),
  ).toHaveAttribute('target', '_blank');
  await page.reload();
  await expect(input).toHaveValue('Condor');
  await page.getByRole('button', { name: 'Limpar busca da Academia' }).click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  expect(new URL(page.url()).searchParams.has('buscar')).toBe(false);
  await input.fill('primer');
  await page.getByRole('link', { name: /Preparação e primer/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Preparação e primer' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Próxima aula' }).click();
  await expect(
    page.getByRole('heading', { name: 'Controle do pincel' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Voltar à aula' }).click();
  await expect(
    page.getByRole('heading', { name: 'Preparação e primer' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Voltar à busca' }).click();
  await expect(input).toHaveValue('primer');
  await expect(input).toBeFocused();
});

test('image extraction uses the selected area and can restore the whole image', async ({
  page,
}) => {
  await page.goto('/encontrar-cores');
  await page.getByRole('button', { name: 'Extrair de imagem' }).click();
  const image = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 80;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#e02020';
    context.fillRect(0, 0, 60, 80);
    context.fillStyle = '#2040e0';
    context.fillRect(60, 0, 60, 80);
    return canvas.toDataURL().split(',')[1]!;
  });
  await page.getByLabel('Imagem de referência').setInputFiles({
    name: 'teste.png',
    mimeType: 'image/png',
    buffer: Buffer.from(image, 'base64'),
  });
  const palette = page.getByRole('group', { name: 'Cores da imagem' });
  await expect(palette.getByRole('button')).toHaveCount(2);
  await page.getByRole('button', { name: 'Recortar referência' }).click();
  const selection = page.getByLabel('Área da imagem para recorte');
  await expect(selection).toBeFocused();
  await selection.press('ArrowRight');
  const leftEdge = page.getByRole('button', { name: 'Borda esquerda' });
  for (let step = 0; step < 6; step += 1)
    await leftEdge.press('Shift+ArrowRight');
  await page.getByRole('button', { name: 'Extrair cores do recorte' }).click();
  await expect(palette.getByRole('button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Usar imagem inteira' }).click();
  await expect(palette.getByRole('button')).toHaveCount(2);
});
