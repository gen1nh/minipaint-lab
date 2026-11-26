import { test,expect } from '@playwright/test';
test('opens color lab',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Abrir laboratório'}).click();await expect(page.getByRole('heading',{name:'Mistura de cores'})).toBeVisible();await expect(page.getByText('Resultado: #919675')).toHaveCount(0);await expect(page.locator('output')).toContainText('Resultado: #');});
