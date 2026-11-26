import {it,expect} from 'vitest';
import {correctMix} from './correct';
import {colorDistance} from './match';
it('only suggests improvements',()=>{const p={brand:'Test',name:'White',code:'',range:'',hex:'#ffffff'};const result=correctMix('#555555','#aaaaaa',5,[p]);expect(result.length).toBeGreaterThan(0);expect(result.every(x=>x.distance<colorDistance('#555555','#aaaaaa'))).toBe(true)});
it('does not change an exact match',()=>expect(correctMix('#555555','#555555',5,[])).toEqual([]));
