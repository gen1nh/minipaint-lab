export type CatalogPaint={brand:string;name:string;code:string;range:string;hex:string};
export function parseCatalog(data:unknown):CatalogPaint[]{
 if(!data||typeof data!=='object')throw new Error('Invalid catalog');
 const {brand,rows}=data as {brand:unknown;rows:unknown};
 if(typeof brand!=='string'||!Array.isArray(rows))throw new Error('Invalid catalog');
 return rows.map((row:unknown)=>{if(!Array.isArray(row)||row.length!==4||!row.every(x=>typeof x==='string')||!/^#[0-9a-f]{6}$/i.test(row[3]))throw new Error('Invalid paint');return {brand,name:row[0] as string,code:row[1] as string,range:row[2] as string,hex:row[3] as string}});
}
export function searchCatalog(paints:CatalogPaint[],query:string){
 const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const terms=norm(query).trim().split(/\s+/);
 return paints.filter(p=>terms.every(t=>norm([p.brand,p.name,p.code,p.range].join(' ')).includes(t))).slice(0,30);
}
