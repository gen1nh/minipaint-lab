import {it,expect} from 'vitest';import {blendAppearance,layerCoverage} from './appearance';
it('preserves endpoints',()=>{expect(blendAppearance('#ff0000','#ffffff',1)).toBe('#ff0000');expect(blendAppearance('#ff0000','#ffffff',0)).toBe('#ffffff')});
it('uses linear light compositing',()=>expect(blendAppearance('#ffffff','#000000',.5)).toBe('#bcbcbc'));
it('increases coverage across coats',()=>expect(layerCoverage(.5,2)).toBe(.75));
