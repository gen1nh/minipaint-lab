import type { Page } from '@playwright/test';

export async function openLabTool(page: Page, name: string) {
  const nav = page.getByRole('navigation', { name: 'Principal' });
  await nav.getByRole('link', { name: 'Laboratório de cores' }).click();
  await page
    .getByRole('main')
    .getByRole('button', { name: new RegExp('^' + name) })
    .click();
}

export async function openMixerFromHome(page: Page) {
  await page.getByRole('button', { name: 'Abrir laboratório' }).click();
  await page
    .getByRole('main')
    .getByRole('button', { name: /^Misturar tintas/ })
    .click();
}
