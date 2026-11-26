import {parseCatalog,type CatalogPaint} from '../domain/color/catalog';
let pending:Promise<CatalogPaint[]>|undefined;
export function loadCatalog(){
 if(!pending)pending=(async()=>{
  const read=async(path:string):Promise<unknown>=>{const r=await fetch(import.meta.env.BASE_URL+'catalog/'+path);if(!r.ok)throw new Error('Catalog unavailable');return r.json()};
  const index=await read('index.json');
  if(!Array.isArray(index)||!index.every(x=>typeof x==='string'&&/^[a-zA-Z0-9_]+$/.test(x)))throw new Error('Invalid index');
  return (await Promise.all(index.map(x=>read(x+'.json')))).flatMap(parseCatalog);
 })().catch(error=>{pending=undefined;throw error});
 return pending;
}
