import {it,expect} from 'vitest';import {dropsToMl,portionCost} from './measure';
it('converts using calibrated drop size',()=>expect(dropsToMl(10,20)).toBe(.5));
it('calculates proportional cost',()=>expect(portionCost(20,20,10,30)).toBe(3));
it('rejects zero calibration',()=>expect(()=>dropsToMl(1,0)).toThrow());
