import { describe,it,expect } from 'vitest';
import { mixRgb } from './mix';
describe('RGB preview',()=>{it('preserves endpoints',()=>{expect(mixRgb('#000000','#ffffff',0)).toBe('#000000');expect(mixRgb('#000000','#ffffff',1)).toBe('#ffffff')});it('interpolates',()=>expect(mixRgb('#000000','#ffffff',.5)).toBe('#808080'));it('rejects invalid ratios',()=>expect(()=>mixRgb('#000000','#ffffff',2)).toThrow());});
