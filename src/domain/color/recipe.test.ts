import {describe,it,expect} from 'vitest';
import {calculateRecipe,scaleRecipe} from './recipe';
const ingredients=[{hex:'#000000',drops:2},{hex:'#ffffff',drops:2}];
describe('recipe',()=>{
 it('calculates quantities and dilution',()=>expect(calculateRecipe(ingredients,4)).toEqual({paint:4,total:8,hex:'#808080',dilution:.5,thinnerPerPaint:1}));
 it('keeps color independent of thinner',()=>expect(calculateRecipe(ingredients,0).hex).toBe(calculateRecipe(ingredients,10).hex));
 it('scales without changing ratios',()=>{const scaled=scaleRecipe(ingredients,2,3);expect(calculateRecipe(scaled.ingredients,scaled.thinner).hex).toBe('#808080');expect(scaled.thinner).toBe(6)});
 it('rejects invalid quantities',()=>expect(()=>calculateRecipe(ingredients,-1)).toThrow());
});
