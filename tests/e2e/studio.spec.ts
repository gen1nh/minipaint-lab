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

test('preserves the current recipe across navigation',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Abrir laboratório'}).click();
 await page.getByRole('button',{name:'Aumentar gotas da tinta 1'}).click();
 const recipe=await page.getByRole('textbox',{name:'Receita em texto'}).inputValue();
 if(await page.getByRole('button',{name:'Menu principal'}).isVisible())await page.getByRole('button',{name:'Menu principal'}).click();
 await page.getByRole('navigation').getByRole('button',{name:'Encontrar cores',exact:true}).click();
 await page.getByRole('button',{name:'Misturar tintas',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Receita em texto'})).toHaveValue(recipe);
});
test('mobile mixer remains within the viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await page.getByRole('button',{name:'Abrir laboratório'}).click();
 await expect(page.getByRole('heading',{name:'Mistura de cores'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});
test('saved recipe survives reload and deletion requires confirmation',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Abrir laboratório'}).click();
 await page.getByText('Livro de receitas (0)',{exact:true}).click();
 await page.getByRole('textbox',{name:'Nome da receita'}).fill('Receita de teste');
 await page.getByRole('button',{name:'Salvar receita'}).click();
 await expect(page.getByText('Livro de receitas (1)',{exact:true})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Abrir laboratório'}).click();
 await page.getByRole('navigation').getByRole('button',{name:'Meu ateliê'}).click();
 page.once('dialog',d=>d.dismiss());
 await page.getByRole('button',{name:'Excluir',exact:true}).click();
 await expect(page.getByText(/Receita de teste ·/)).toBeVisible();
});

test('home groups color tools and atelier lists saved recipes',async({page})=>{await page.goto('/');const nav=page.getByRole('navigation');await nav.getByRole('button',{name:'Laboratório de cores'}).click();await expect(nav.getByRole('button',{name:'Misturar tintas'})).toHaveCount(0);await nav.getByRole('button',{name:'Laboratório de cores'}).click();await expect(nav.getByRole('button',{name:'Misturar tintas'})).toBeVisible();await page.getByRole('button',{name:'Abrir ateliê'}).click();await expect(page.getByRole('heading',{name:'Meu ateliê'})).toBeVisible();await expect(page.getByText('Nenhuma receita salva.',{exact:true})).toBeVisible()});
