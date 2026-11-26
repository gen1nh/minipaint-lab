import {expect,it} from 'vitest';
import {colorDistance,matchPaints,reverseMix} from './match';
const paints=[{brand:'Test',name:'Red',code:'1',range:'Test',hex:'#ff0000'},{brand:'Test',name:'Yellow',code:'2',range:'Test',hex:'#ffff00'}];
it('ranks exact digital matches first',()=>{expect(colorDistance('#ff0000','#ff0000')).toBe(0);expect(matchPaints('#ff0000',paints)[0]?.paint.name).toBe('Red')});
it('returns bounded two-paint recipes',()=>{const result=reverseMix('#ff440f',paints);expect(result.length).toBe(5);expect(result[0]?.ingredients).toHaveLength(2)});
