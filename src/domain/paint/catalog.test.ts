import {describe,it,expect} from 'vitest';
import {isPaint,searchPaints} from './catalog';
const paint={id:'1',brand:'Acrilex',line:'Fosca',code:'123',name:'Azul Céu',hex:'#abcdef',ml:60};
describe('catalog',()=>{it('matches accents and brand',()=>expect(searchPaints([paint],'acrilEX ceu')).toEqual([paint]));it('rejects invalid stock',()=>expect(isPaint({...paint,ml:-1})).toBe(false));it('accepts unknown stock',()=>expect(isPaint({...paint,ml:null})).toBe(true));});
