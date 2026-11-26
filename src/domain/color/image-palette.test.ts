import {it,expect} from 'vitest';import {dominantColors} from './image-palette';
it('ranks opaque colors and ignores transparent pixels',()=>expect(dominantColors(new Uint8ClampedArray([255,0,0,255,255,0,0,255,0,0,255,255,0,255,0,0]))).toEqual(['#ff0000','#0000ff']));
it('handles transparent images',()=>expect(dominantColors(new Uint8ClampedArray([0,0,0,0]))).toEqual([]));
