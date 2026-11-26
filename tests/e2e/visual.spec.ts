import {test,expect} from '@playwright/test';
for(const width of [390,1280]){
 test('color workspace '+width,async({page},info)=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await page.getByRole('button',{name:'Abrir laboratório'}).click();
  const search=page.getByRole('textbox',{name:'Buscar tinta comercial'}).first();
  await search.focus();
  await expect(search).toBeFocused();
  await search.fill('Acrilex 505');
  await expect(page.getByRole('button',{name:/Amarelo Ouro/}).first()).toBeVisible();
  await page.screenshot({path:info.outputPath('mixer-dark.png'),fullPage:true});
  await page.getByRole('button',{name:'Alternar tema'}).click();
  await page.screenshot({path:info.outputPath('mixer-light.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
  await page.getByRole('button',{name:'Encontrar cores',exact:true}).click();
  await expect(page.getByRole('button',{name:'Buscar equivalentes e misturas'})).toBeEnabled();
  await page.getByRole('button',{name:'Buscar equivalentes e misturas'}).click();
  await expect(page.getByRole('heading',{name:'Tintas próximas'})).toBeVisible();
  await page.screenshot({path:info.outputPath('matches.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
 });
}
