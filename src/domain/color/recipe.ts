export type Ingredient = { hex: string; drops: number };
export function calculateRecipe(ingredients: Ingredient[], thinner: number) {
  if (!Number.isSafeInteger(thinner) || thinner < 0 || !ingredients.length || ingredients.some(p => !/^#[0-9a-f]{6}$/i.test(p.hex) || !Number.isSafeInteger(p.drops) || p.drops < 1)) throw new RangeError('Invalid recipe');
  const paint = ingredients.reduce((sum,p)=>sum+p.drops,0);
  const total = paint + thinner;
  return {paint,total, dilution: thinner/total, thinnerPerPaint: thinner/paint};
}
export function scaleRecipe(ingredients: Ingredient[], thinner: number, factor: number) {
  calculateRecipe(ingredients, thinner);
  if (!Number.isSafeInteger(factor) || factor < 1) throw new RangeError('Invalid multiplier');
  return {ingredients: ingredients.map(p=>({...p,drops:p.drops*factor})), thinner:thinner*factor};
}
