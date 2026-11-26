import { describe, it, expect } from 'vitest';
import { calculateRecipe } from './recipe';
const ingredients = [
  { hex: '#000000', drops: 2 },
  { hex: '#ffffff', drops: 2 },
];
describe('recipe', () => {
  it('calculates quantities and dilution', () =>
    expect(calculateRecipe(ingredients, 4)).toEqual({
      paint: 4,
      total: 8,
      dilution: 0.5,
      thinnerPerPaint: 1,
    }));
  it('rejects invalid quantities', () =>
    expect(() => calculateRecipe(ingredients, -1)).toThrow());
});
