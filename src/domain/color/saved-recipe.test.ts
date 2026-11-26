import {it,expect} from 'vitest';import {isSavedRecipe,mergeRecipeBackup} from './saved-recipe';
const recipe={id:'a',name:'Test',hex:'#abcdef',thinner:0,paints:[{name:'Blue',brand:'Test',hex:'#0000ff',drops:2,tintingStrength:1.5}]};
it('accepts a calibrated recipe',()=>expect(isSavedRecipe(recipe)).toBe(true));
it('rejects invalid amounts and colors',()=>{expect(isSavedRecipe({...recipe,thinner:-1})).toBe(false);expect(isSavedRecipe({...recipe,paints:[{...recipe.paints[0],hex:'invalid'}]})).toBe(false)});

it('imports only new recipe content',()=>{const other={...recipe,name:'Other'};expect(mergeRecipeBackup([recipe],[{...recipe,id:'different'},other,other],()=> 'new')).toEqual([recipe,{...other,id:'new'}])});
