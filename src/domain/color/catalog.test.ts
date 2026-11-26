import {describe,it,expect} from 'vitest';
import {parseCatalog,searchCatalog} from './catalog';
describe('catalog',()=>{it('searches names and codes without accents',()=>{const p=parseCatalog({brand:'Acrilex',rows:[['Azul Céu','123','Fosca','#abcdef']]});expect(searchCatalog(p,'ceu 123')).toEqual(p)});it('rejects invalid hex',()=>expect(()=>parseCatalog({brand:'A',rows:[['B','1','C','bad']]})).toThrow())});
