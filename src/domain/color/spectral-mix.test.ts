import {describe,it,expect} from 'vitest';
import {mixPigments} from './spectral-mix';
describe('spectral preview',()=>{
 const colors=[{hex:'#002185',drops:1},{hex:'#fcd200',drops:1}];
 it('matches upstream blue-yellow example',()=>expect(mixPigments(colors)).toBe('#3d933e'));
 it('preserves single paint',()=>expect(mixPigments([colors[0]!])).toBe('#002185'));
 it('is invariant under proportional scaling',()=>expect(mixPigments(colors.map(p=>({...p,drops:5})))).toBe(mixPigments(colors)));
 it('rejects zero quantities',()=>expect(()=>mixPigments([{hex:'#ffffff',drops:0}])).toThrow());
});
