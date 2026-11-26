import { openLabTool, openMixerFromHome } from './navigation';
import { test, expect } from '@playwright/test';
for (const width of [390, 1280]) {
  test('color workspace ' + width, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await openMixerFromHome(page);
    await page
      .getByRole('button', { name: /Trocar tinta/ })
      .first()
      .click();
    const search = page
      .getByRole('textbox', { name: 'Buscar tinta comercial' })
      .first();
    await search.focus();
    await expect(search).toBeFocused();
    await search.fill('Acrilex 505');
    await expect(
      page.getByRole('button', { name: /Amarelo Ouro/ }).first(),
    ).toBeVisible();
    await page.screenshot({
      path: info.outputPath('mixer-dark.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Alternar tema' }).click();
    await page.screenshot({
      path: info.outputPath('mixer-light.png'),
      fullPage: true,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width + 1);
    await openLabTool(page, 'Encontrar cores');
    await expect(
      page.getByRole('button', { name: 'Buscar tintas próximas' }),
    ).toBeEnabled();
    await page
      .getByRole('button', { name: 'Buscar tintas próximas' })
      .click();
    await expect(
      page.getByRole('heading', { name: 'Tintas próximas' }),
    ).toBeVisible();
    await page.screenshot({
      path: info.outputPath('matches.png'),
      fullPage: true,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width + 1);
  });
}

for (const width of [320, 1280]) {
  test(
    'cel shading layout and recolor stay within the intended area at ' + width,
    async ({ page }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await openLabTool(page, 'Cel shading');
      await page.getByLabel('Ilustração').selectOption('wikipe');
      const portrait = page.locator('.cel-artwork-image');
      const colored = await portrait.getAttribute('src');
      await page.getByRole('button', { name: 'Ver cores originais' }).click();
      const original = await portrait.getAttribute('src');
      const geometry = await page
        .locator('.cel-workbench')
        .evaluate((panel) => {
          const stage = panel
            .querySelector('.cel-stage')!
            .getBoundingClientRect();
          const art = panel
            .querySelector('.cel-artwork-image')!
            .getBoundingClientRect();
          const settings = panel
            .querySelector('.cel-settings')!
            .getBoundingClientRect();
          return {
            fillsStage:
              stage.width === art.width && stage.height === art.height,
            controlsBeforeArtwork: settings.bottom <= stage.top,
            sideBySide:
              panel.querySelector('.cel-editor')!.getBoundingClientRect()
                .right <=
              panel.querySelector('.cel-preview')!.getBoundingClientRect().left,
            fitsViewport: document.documentElement.scrollWidth <= innerWidth,
          };
        });
      expect(geometry).toEqual({
        fillsStage: true,
        controlsBeforeArtwork: width === 320,
        sideBySide: width === 1280,
        fitsViewport: true,
      });
      const pixels = await page.evaluate(
        async ({ colored, original }) => {
          async function read(src: string) {
            const image = new Image();
            image.src = src;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 342;
            const context = canvas.getContext('2d')!;
            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, 400, 342).data;
          }
          const before = await read(original!);
          const after = await read(colored!);
          let changed = 0;
          for (let offset = 0; offset < before.length; offset += 4) {
            if (
              before[offset] !== after[offset] ||
              before[offset + 1] !== after[offset + 1] ||
              before[offset + 2] !== after[offset + 2]
            )
              changed++;
          }
          const samePixel = (x: number, y: number) => {
            const offset = (y * 400 + x) * 4;
            return before
              .slice(offset, offset + 4)
              .every((value, index) => value === after[offset + index]);
          };
          return {
            changed,
            background: samePixel(0, 0),
            clothing: samePixel(150, 315),
          };
        },
        { colored, original },
      );
      expect(pixels.changed).toBeGreaterThan(20000);
      expect(pixels.changed).toBeLessThan(40000);
      expect(pixels).toMatchObject({ background: true, clothing: true });
      await page.screenshot({
        path: info.outputPath('cel-original.png'),
        fullPage: true,
      });
    },
  );
}
