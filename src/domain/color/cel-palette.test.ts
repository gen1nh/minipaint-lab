import {it,expect} from 'vitest';
import {celPalette} from './cel-palette';
it('preserves base and generates five valid swatches',()=>{const p=celPalette('#d46b26',1);expect(p).toHaveLength(5);expect(p[2]?.hex).toBe('#d46b26');expect(p.every(x=>/^#[0-9a-f]{6}$/.test(x.hex))).toBe(true)});
it('rejects invalid contrast',()=>expect(()=>celPalette('#ffffff',2)).toThrow());
