export type PaintRecord={id:string;brand:string;line:string;code:string;name:string;hex:string;ml:number|null};
export function isPaint(value:unknown):value is PaintRecord{
 if(!value||typeof value!=='object')return false;
 const p=value as PaintRecord;
 return [p.id,p.brand,p.line,p.code,p.name,p.hex].every(x=>typeof x==='string')&&!!p.id&&!!p.name.trim()&&/^#[0-9a-f]{6}$/i.test(p.hex)&&(p.ml===null||(typeof p.ml==='number'&&Number.isFinite(p.ml)&&p.ml>=0));
}
export function searchPaints(paints:PaintRecord[],query:string){
 const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const terms=normalize(query).trim().split(/\s+/);
 return paints.filter(p=>terms.every(t=>normalize([p.brand,p.line,p.code,p.name,p.hex].join(' ')).includes(t)));
}
