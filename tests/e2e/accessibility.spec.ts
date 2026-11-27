import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';
import type axe from 'axe-core';

const script = createRequire(import.meta.url).resolve('axe-core/axe.min.js');

for (const theme of ['light', 'dark']) {
  test(`primary screens pass automated accessibility checks in ${theme} mode`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 850 });
    await page.addInitScript(
      (value) => localStorage.setItem('minipaint:theme', value),
      theme,
    );
    for (const route of [
      '/',
      '/academia',
      '/academia/projetos',
      '/misturar-tintas',
      '/encontrar-cores',
    ]) {
      await page.goto(route);
      await expect(page.locator('main h1:visible')).toBeVisible();
      if (route === '/misturar-tintas') {
        await page.getByRole('button', { name: 'Salvar mistura' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
      }
      await page.addScriptTag({ path: script });
      const violations = await page.evaluate(async () => {
        const engine = (window as Window & { axe?: typeof axe }).axe!;
        const result = await engine.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
        });
        return result.violations.map((rule) => ({
          id: rule.id,
          targets: rule.nodes.map((node) => node.target),
        }));
      });
      expect(violations, route).toEqual([]);
    }
  });
}
