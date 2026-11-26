import {test,expect} from '@playwright/test';
test('builds and scales a recipe',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Abrir laboratório'}).click();
 await expect(page.getByRole('heading',{name:'Mistura de cores'})).toBeVisible();
 await expect(page.locator('output')).toContainText('Resultado: #');
 await page.getByRole('button',{name:'Adicionar tinta'}).click();
 await expect(page.getByRole('group',{name:/Tinta 3/})).toBeVisible();
 await page.getByRole('button',{name:'Aplicar multiplicador'}).click();
 await expect(page.getByRole('textbox',{name:'Receita em texto'})).toHaveValue(/6 gotas de diluente/);
});

test('selects a commercial paint',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Abrir laboratório'}).click();const first=page.getByRole('group',{name:/Tinta 1/});await first.getByRole('textbox',{name:'Buscar tinta comercial'}).fill('Acrilex 505');await first.getByRole('button',{name:/Amarelo Ouro/}).click();await expect(page.getByRole('textbox',{name:'Receita em texto'})).toHaveValue(/Acrilex.*Amarelo Ouro/)});
